import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { IMAGE_QUERY_KEY } from "../query/get-image-detail.query"
import { IMAGES_QUERY_KEY } from "../query/get-images.query"

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.images[":id"].$delete({ param: { id } })
      const data = await res.json()
      if ("error" in data) {
        throw new Error(data.message)
      }
      return data
    },
    onSuccess: () => {
      toast.success("Image has been deleted successfully")
    },
    onError: (e) => {
      toast.error(e.message)
    },
    onSettled: (_response, _error, id, _result, context) => {
      context.client.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
      context.client.invalidateQueries({
        queryKey: [IMAGE_QUERY_KEY, id],
        exact: true,
      })
    },
  })
}
