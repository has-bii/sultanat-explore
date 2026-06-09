import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"

import { DESTINATION_QUERY_KEY } from "../queries/get-destination.query"
import { DESTINATIONS_QUERY_KEY } from "../queries/get-destinations.query"

const $addGalleryImage = apiClient.api.destinations[":id"].gallery.$post

export const ADD_GALLERY_IMAGE_MUTATION_KEY = ["add-gallery-image"] as const

export const useAddGalleryImage = (destinationId: string) => {
  return useMutation({
    mutationKey: [...ADD_GALLERY_IMAGE_MUTATION_KEY, destinationId],
    mutationFn: async (input: InferRequestType<typeof $addGalleryImage>["json"]) => {
      const res = await $addGalleryImage({ param: { id: destinationId }, json: input })
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
      context.client.invalidateQueries({ queryKey: [DESTINATIONS_QUERY_KEY], exact: false })
    },
  })
}
