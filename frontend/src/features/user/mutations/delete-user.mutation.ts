import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { userQueryKeys } from "../queries"

const $deleteUser = apiClient.api.users[":id"].$delete

export const DELETE_USER_MUTATION_KEY = ["delete-user"] as const

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: DELETE_USER_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteUser({ param: { id } })
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
        queryKey: userQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: userQueryKeys.all(),
        exact: false,
      })
    },
  })
}
