import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

import { inclusionItemQueryKeys } from "../queries"

const $deleteInclusionItem = apiClient.api["inclusion-items"][":id"].$delete

export const DELETE_INCLUSION_ITEM_MUTATION_KEY = ["delete-inclusion-item"] as const

export const useDeleteInclusionItem = () => {
  return useMutation({
    mutationKey: DELETE_INCLUSION_ITEM_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteInclusionItem({ param: { id } })
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
    onSettled: (_res, _err, _id, _result, context) => {
      context.client.invalidateQueries({
        queryKey: inclusionItemQueryKeys.all(),
        exact: false,
      })
    },
  })
}
