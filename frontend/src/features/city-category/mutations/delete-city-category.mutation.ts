import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { cityCategoryQueryKeys } from "../queries"

const $deleteCityCategory = apiClient.api["city-categories"][":id"].$delete

export const DELETE_CITY_CATEGORY_MUTATION_KEY = ["delete-city-category"] as const

export const useDeleteCityCategory = () => {
  return useMutation({
    mutationKey: DELETE_CITY_CATEGORY_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteCityCategory({ param: { id } })
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
        queryKey: cityCategoryQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: cityCategoryQueryKeys.all(),
        exact: false,
      })
    },
  })
}