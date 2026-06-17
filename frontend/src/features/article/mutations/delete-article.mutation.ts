import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { articleQueryKeys } from "../queries"

const $deleteArticle = apiClient.api.articles[":id"].$delete

export const DELETE_ARTICLE_MUTATION_KEY = ["delete-article"] as const

export const useDeleteArticle = () => {
  return useMutation({
    mutationKey: DELETE_ARTICLE_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteArticle({ param: { id } })
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
        queryKey: articleQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: articleQueryKeys.all(),
        exact: false,
      })
    },
  })
}
