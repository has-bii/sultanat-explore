import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { attractionQueryKeys } from "../queries"

const $updateAttraction = apiClient.api.attractions[":id"].$patch

export const UPDATE_ATTRACTION_MUTATION_KEY = ["update-attraction"] as const

export const useUpdateAttraction = (id: string) => {
  return useMutation({
    mutationKey: [...UPDATE_ATTRACTION_MUTATION_KEY, id],
    mutationFn: async (input: InferRequestType<typeof $updateAttraction>["json"]) => {
      const res = await $updateAttraction({
        param: { id },
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
