import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { openTripQueryKeys } from "../queries"

const $deleteOpenTrip = apiClient.api["open-trips"][":id"].$delete

export const DELETE_OPEN_TRIP_MUTATION_KEY = ["delete-open-trip"] as const

export const useDeleteOpenTrip = () => {
  return useMutation({
    mutationKey: DELETE_OPEN_TRIP_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteOpenTrip({ param: { id } })
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
        queryKey: openTripQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: openTripQueryKeys.all(),
        exact: false,
      })
    },
  })
}
