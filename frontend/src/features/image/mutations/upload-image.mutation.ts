import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { InferRequestType } from "hono"

import { IMAGES_QUERY_KEY } from "../query/get-images.query"

const $uploadImage = apiClient.api.images.$post
type UploadImageInputType = InferRequestType<typeof $uploadImage>

const _$uploadImage = async (data: UploadImageInputType) => {
  const res = await $uploadImage(data)
  const resData = await res.json()
  if ("error" in resData) throw new Error(resData.message)
  return resData
}

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (inputs: UploadImageInputType[]) => {
      const results = await Promise.allSettled(inputs.map((input) => _$uploadImage(input)))

      return results.map((result) => {
        if (result.status === "fulfilled") {
          return { success: true }
        } else {
          return { success: false, error: result.reason.message as string }
        }
      })
    },
    onSettled: (_res, _err, _var, _result, context) => {
      context.client.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
    },
  })
}
