import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { attractionQueryKeys } from "../queries"

const $createAttraction = apiClient.api.attractions.$post

export const CREATE_ATTRACTION_MUTATION_KEY = ["create-attraction"] as const

export const useCreateAttraction = () => {
  return useMutation({
    mutationKey: CREATE_ATTRACTION_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createAttraction>["json"]) => {
      const res = await $createAttraction({
        json: input,
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
    onSettled: (_res, _err, _var, _result, context) => {
      context.client.invalidateQueries({
        queryKey: attractionQueryKeys.all(),
        exact: false,
      })
    },
  })
}
