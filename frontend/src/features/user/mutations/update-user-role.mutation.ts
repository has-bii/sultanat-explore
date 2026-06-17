import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { userQueryKeys } from "../queries"

const $updateUserRole = apiClient.api.users[":id"].$patch

export const UPDATE_USER_ROLE_MUTATION_KEY = ["update-user-role"] as const

export const useUpdateUserRole = () => {
  return useMutation({
    mutationKey: UPDATE_USER_ROLE_MUTATION_KEY,
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: InferRequestType<typeof $updateUserRole>["json"]
    }) => {
      const res = await $updateUserRole({ param: { id }, json: input })
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
        queryKey: userQueryKeys.all(),
        exact: false,
      })
    },
  })
}
