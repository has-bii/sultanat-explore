import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

import { categoryQueryKeys } from "../queries"

const $deleteCategory = apiClient.api.categories[":id"].$delete

export const DELETE_CATEGORY_MUTATION_KEY = ["delete-category"] as const

export const useDeleteCategory = () => {
  return useMutation({
    mutationKey: DELETE_CATEGORY_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteCategory({ param: { id } })
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
      context.client.invalidateQueries({
        queryKey: categoryQueryKeys.all(),
        exact: false,
      })
    },
  })
}
