import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"

import { DESTINATION_QUERY_KEY } from "../queries/get-destination.query"
import { DESTINATIONS_QUERY_KEY } from "../queries/get-destinations.query"

const $updateDestination = apiClient.api.destinations[":id"].$patch

export const UPDATE_DESTINATION_MUTATION_KEY = ["update-destination"] as const

export const useUpdateDestination = (id: string) => {
  return useMutation({
    mutationKey: [...UPDATE_DESTINATION_MUTATION_KEY, id],
    mutationFn: async (input: InferRequestType<typeof $updateDestination>["json"]) => {
      const res = await $updateDestination({ param: { id }, json: input })
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
      context.client.invalidateQueries({ queryKey: [DESTINATION_QUERY_KEY, id] })
      context.client.invalidateQueries({ queryKey: [DESTINATIONS_QUERY_KEY], exact: false })
    },
  })
}
