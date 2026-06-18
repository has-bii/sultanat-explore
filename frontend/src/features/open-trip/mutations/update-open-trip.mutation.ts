import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { openTripQueryKeys } from "../queries"

const $updateOpenTrip = apiClient.api["open-trips"][":id"].$put

export const UPDATE_OPEN_TRIP_MUTATION_KEY = ["update-open-trip"] as const

export const useUpdateOpenTrip = (id: string) => {
  return useMutation({
    mutationKey: [...UPDATE_OPEN_TRIP_MUTATION_KEY, id],
    mutationFn: async (input: InferRequestType<typeof $updateOpenTrip>["json"]) => {
      const res = await $updateOpenTrip({ param: { id }, json: input })
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
