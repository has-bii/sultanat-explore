import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { IMAGE_QUERY_KEY } from "../query/get-image-detail.query"
import { IMAGES_QUERY_KEY } from "../query/get-images.query"

export const useDeleteImage = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.api.images[":id"].$delete({ param: { id } })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.message)
      }
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (e) => {
      toast.error(e.message)
    },
    onSettled: (_data, _error, _vars, _result, context) => {
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
