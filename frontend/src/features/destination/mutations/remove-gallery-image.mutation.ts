import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

import { DESTINATION_QUERY_KEY } from "../queries/get-destination.query"
import { DESTINATIONS_QUERY_KEY } from "../queries/get-destinations.query"

const $removeGalleryImage = apiClient.api.destinations[":id"].gallery[":imageId"].$delete

export const REMOVE_GALLERY_IMAGE_MUTATION_KEY = ["remove-gallery-image"] as const

export const useRemoveGalleryImage = (destinationId: string) => {
  return useMutation({
    mutationKey: [...REMOVE_GALLERY_IMAGE_MUTATION_KEY, destinationId],
    mutationFn: async (imageId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await ($removeGalleryImage as any)({
        param: { id: destinationId, imageId },
      })
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
