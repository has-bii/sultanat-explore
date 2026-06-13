import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { InferRequestType } from "hono"
import { toast } from "sonner"

import { imageQueryKeys } from "../queries"

const $uploadImage = apiClient.api.images.$post
type UploadImageInputType = InferRequestType<typeof $uploadImage>

export const UPLOAD_IMAGES_MUTATION_KEY = ["upload-images"] as const

export const useUploadImages = () => {
  return useMutation({
    mutationKey: UPLOAD_IMAGES_MUTATION_KEY,
    mutationFn: async (form: UploadImageInputType["form"]) => {
      const res = await $uploadImage({ form })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (e) => {
      toast.error(e.message)
    },
    onSettled: (_res, _err, _var, _result, context) => {
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.all(),
        exact: false,
      })
    },
  })
}
