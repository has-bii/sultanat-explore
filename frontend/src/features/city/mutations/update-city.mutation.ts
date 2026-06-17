import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { cityQueryKeys } from "../queries"

const $updateCity = apiClient.api.cities[":id"].$patch

export const UPDATE_CITY_MUTATION_KEY = ["update-city"] as const

export const useUpdateCity = (id: string) => {
  return useMutation({
    mutationKey: [...UPDATE_CITY_MUTATION_KEY, id],
    mutationFn: async (input: InferRequestType<typeof $updateCity>["json"]) => {
      const res = await $updateCity({ param: { id }, json: input })
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
        queryKey: cityQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: cityQueryKeys.all(),
        exact: false,
      })
    },
  })
}
