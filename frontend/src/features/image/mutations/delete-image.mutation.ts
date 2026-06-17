import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { imageQueryKeys } from "../queries"

const $deleteImage = apiClient.api.images[":id"].$delete

export const DELETE_IMAGE_MUTATION_KEY = ["delete-image"] as const

export const useDeleteImage = () => {
  return useMutation({
    mutationKey: DELETE_IMAGE_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteImage({ param: { id } })
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
    onSettled: (_res, _err, id, _result, context) => {
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.all(),
        exact: false,
      })
    },
  })
}
