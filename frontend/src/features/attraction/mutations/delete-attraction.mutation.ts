import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { attractionQueryKeys } from "../queries"

const $deleteAttraction = apiClient.api.attractions[":id"].$delete

export const DELETE_ATTRACTION_MUTATION_KEY = ["delete-attraction"] as const

export const useDeleteAttraction = () => {
  return useMutation({
    mutationKey: DELETE_ATTRACTION_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteAttraction({
        param: { id },
      })
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
        queryKey: attractionQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: attractionQueryKeys.all(),
        exact: false,
      })
    },
  })
}
