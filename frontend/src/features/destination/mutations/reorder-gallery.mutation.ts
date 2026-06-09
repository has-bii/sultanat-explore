import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"

import { DESTINATION_QUERY_KEY } from "../queries/get-destination.query"

const $reorderGallery = apiClient.api.destinations[":id"].gallery.reorder.$put

export const REORDER_GALLERY_MUTATION_KEY = ["reorder-gallery"] as const

export const useReorderGallery = (destinationId: string) => {
  return useMutation({
    mutationKey: [...REORDER_GALLERY_MUTATION_KEY, destinationId],
    mutationFn: async (input: InferRequestType<typeof $reorderGallery>["json"]) => {
      const res = await $reorderGallery({ param: { id: destinationId }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _err, _var, _result, context) => {
      context.client.invalidateQueries({ queryKey: [DESTINATION_QUERY_KEY, destinationId] })
    },
  })
}
