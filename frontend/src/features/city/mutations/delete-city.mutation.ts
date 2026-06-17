import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { cityQueryKeys } from "../queries"

const $deleteCity = apiClient.api.cities[":id"].$delete

export const DELETE_CITY_MUTATION_KEY = ["delete-city"] as const

export const useDeleteCity = () => {
  return useMutation({
    mutationKey: DELETE_CITY_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteCity({ param: { id } })
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
