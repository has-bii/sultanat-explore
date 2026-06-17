import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { articleQueryKeys } from "../queries"

const $createArticle = apiClient.api.articles.$post

export const CREATE_ARTICLE_MUTATION_KEY = ["create-article"] as const

export const useCreateArticle = () => {
  return useMutation({
    mutationKey: CREATE_ARTICLE_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createArticle>["json"]) => {
      const res = await $createArticle({ json: input })
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
        queryKey: articleQueryKeys.all(),
        exact: false,
      })
    },
  })
}
