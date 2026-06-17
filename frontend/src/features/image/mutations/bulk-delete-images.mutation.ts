import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { imageQueryKeys } from "../queries"

const $bulkDeleteImages = apiClient.api.images["bulk-delete"].$post

export const BULK_DELETE_IMAGES_MUTATION_KEY = ["bulk-delete-images"] as const

export const useBulkDeleteImages = () => {
  return useMutation({
    mutationKey: BULK_DELETE_IMAGES_MUTATION_KEY,
    mutationFn: async (ids: string[]) => {
      const res = await $bulkDeleteImages({ json: { ids } })
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
    onSettled: (_res, _err, _vars, _result, context) => {
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.all(),
        exact: false,
      })
    },
  })
}
