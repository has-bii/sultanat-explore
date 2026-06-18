import type { InferRequestType } from "hono"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

import { inclusionItemQueryKeys } from "../queries"

const $updateInclusionItem = apiClient.api["inclusion-items"][":id"].$put

export const UPDATE_INCLUSION_ITEM_MUTATION_KEY = ["update-inclusion-item"] as const

export const useUpdateInclusionItem = () => {
  return useMutation({
    mutationKey: UPDATE_INCLUSION_ITEM_MUTATION_KEY,
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: InferRequestType<typeof $updateInclusionItem>["json"]
    }) => {
      const res = await $updateInclusionItem({ param: { id }, json: input })
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
        queryKey: inclusionItemQueryKeys.all(),
        exact: false,
      })
    },
  })
}
