import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { cityQueryKeys } from "../queries"

const $createCity = apiClient.api.cities.$post

export const CREATE_CITY_MUTATION_KEY = ["create-city"] as const

export const useCreateCity = () => {
  return useMutation({
    mutationKey: CREATE_CITY_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createCity>["json"]) => {
      const res = await $createCity({ json: input })
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
        queryKey: cityQueryKeys.all(),
        exact: false,
      })
    },
  })
}
