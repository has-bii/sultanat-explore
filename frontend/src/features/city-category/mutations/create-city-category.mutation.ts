import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { cityCategoryQueryKeys } from "../queries"

const $createCityCategory = apiClient.api["city-categories"].$post

export const CREATE_CITY_CATEGORY_MUTATION_KEY = ["create-city-category"] as const

export const useCreateCityCategory = () => {
  return useMutation({
    mutationKey: CREATE_CITY_CATEGORY_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createCityCategory>["json"]) => {
      const res = await $createCityCategory({ json: input })
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
        queryKey: cityCategoryQueryKeys.all(),
        exact: false,
      })
    },
  })
}