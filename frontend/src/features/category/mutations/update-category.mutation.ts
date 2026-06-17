import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { categoryQueryKeys } from "../queries"

const $updateCategory = apiClient.api.categories[":id"].$patch

export const UPDATE_CATEGORY_MUTATION_KEY = ["update-category"] as const

export const useUpdateCategory = () => {
  return useMutation({
    mutationKey: UPDATE_CATEGORY_MUTATION_KEY,
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: InferRequestType<typeof $updateCategory>["json"]
    }) => {
      const res = await $updateCategory({ param: { id }, json: input })
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
    onSettled: (_res, _err, vars, _result, context) => {
      context.client.invalidateQueries({
        queryKey: categoryQueryKeys.detail(vars.id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: categoryQueryKeys.all(),
        exact: false,
      })
    },
  })
}
