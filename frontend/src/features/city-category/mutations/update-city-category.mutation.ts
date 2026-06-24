import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { cityCategoryQueryKeys } from "../queries"

const $updateCityCategory = apiClient.api["city-categories"][":id"].$patch

export const UPDATE_CITY_CATEGORY_MUTATION_KEY = ["update-city-category"] as const

export const useUpdateCityCategory = () => {
  return useMutation({
    mutationKey: UPDATE_CITY_CATEGORY_MUTATION_KEY,
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: InferRequestType<typeof $updateCityCategory>["json"]
    }) => {
      const res = await $updateCityCategory({ param: { id }, json: input })
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
    onSettled: (_res, _err, vars, _result, context) => {
      context.client.invalidateQueries({
        queryKey: cityCategoryQueryKeys.detail(vars.id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: cityCategoryQueryKeys.all(),
        exact: false,
      })
    },
  })
}