import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { InferRequestType } from "hono"
import { toast } from "sonner"

import { IMAGE_QUERY_KEY } from "../query/get-image-detail.query"
import { IMAGES_QUERY_KEY } from "../query/get-images.query"

const $updateImage = apiClient.api.images[":id"].$patch
type UpdateImageInputType = InferRequestType<typeof $updateImage>

export const useUpdateImage = () => {
  return useMutation({
    mutationFn: async (input: UpdateImageInputType) => {
      const res = await $updateImage(input)
      const data = await res.json()
      if ("error" in data) throw new Error(data.message)
      return data
    },
    onSuccess: () => {
      toast.success("Image has updated successfully")
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_data, _error, input, _result, context) => {
      context.client.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
      context.client.invalidateQueries({
        queryKey: [IMAGE_QUERY_KEY, input.param.id],
        exact: true,
      })
    },
  })
}
