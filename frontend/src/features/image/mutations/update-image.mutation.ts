import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { imageQueryKeys } from "../queries"

const $updateImage = apiClient.api.images[":id"].$patch
type UpdateImageInputType = InferRequestType<typeof $updateImage>["json"]

export const UPDATE_IMAGE_MUTATION_KEY = ["update-image"] as const

export const useUpdateImage = (id: string) => {
  return useMutation({
    mutationKey: [...UPDATE_IMAGE_MUTATION_KEY, id],
    mutationFn: async (input: UpdateImageInputType) => {
      const res = await $updateImage({
        param: { id },
        json: input,
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onSettled: (_res, _error, _vars, _result, context) => {
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.all(),
        exact: false,
      })
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.detail(id),
        exact: true,
      })
    },
  })
}
