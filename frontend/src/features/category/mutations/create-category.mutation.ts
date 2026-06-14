import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"

import { categoryQueryKeys } from "../queries"

const $createCategory = apiClient.api.categories.$post

export const CREATE_CATEGORY_MUTATION_KEY = ["create-category"] as const

export const useCreateCategory = () => {
  return useMutation({
    mutationKey: CREATE_CATEGORY_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createCategory>["json"]) => {
      const res = await $createCategory({ json: input })
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
