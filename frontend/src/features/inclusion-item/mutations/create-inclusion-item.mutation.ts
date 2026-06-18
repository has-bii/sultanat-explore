import type { InferRequestType } from "hono"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

import { inclusionItemQueryKeys } from "../queries"

const $createInclusionItem = apiClient.api["inclusion-items"].$post

export const CREATE_INCLUSION_ITEM_MUTATION_KEY = ["create-inclusion-item"] as const

export const useCreateInclusionItem = () => {
  return useMutation({
    mutationKey: CREATE_INCLUSION_ITEM_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createInclusionItem>["json"]) => {
      const res = await $createInclusionItem({ json: input })
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
        queryKey: inclusionItemQueryKeys.all(),
        exact: false,
      })
    },
  })
}
