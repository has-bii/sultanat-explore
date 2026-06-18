import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { openTripQueryKeys } from "../queries"

const $createOpenTrip = apiClient.api["open-trips"].$post

export const CREATE_OPEN_TRIP_MUTATION_KEY = ["create-open-trip"] as const

export const useCreateOpenTrip = () => {
  return useMutation({
    mutationKey: CREATE_OPEN_TRIP_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createOpenTrip>["json"]) => {
      const res = await $createOpenTrip({ json: input })
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
        queryKey: openTripQueryKeys.all(),
        exact: false,
      })
    },
  })
}
