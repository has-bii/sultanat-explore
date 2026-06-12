import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { destinationQueryKeys } from "../queries"

const $syncGallery = apiClient.api.destinations[":id"].gallery.$put

export const UPDATE_GALLERY_MUTATION_KEY = ["update-gallery"] as const

export const useUpdateGallery = (destinationId: string) => {
  return useMutation({
    mutationKey: [...UPDATE_GALLERY_MUTATION_KEY, destinationId],
    mutationFn: async (input: InferRequestType<typeof $syncGallery>["json"]) => {
      const res = await $syncGallery({ param: { id: destinationId }, json: input })
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
      context.client.invalidateQueries({
        queryKey: destinationQueryKeys.gallery(destinationId),
        exact: true,
      })
    },
  })
}
