import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { userQueryKeys } from "../queries"

const $createUser = apiClient.api.users.$post

export const CREATE_USER_MUTATION_KEY = ["create-user"] as const

export const useCreateUser = () => {
  return useMutation({
    mutationKey: CREATE_USER_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createUser>["json"]) => {
      const res = await $createUser({ json: input })
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
