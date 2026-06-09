import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"

import { DESTINATIONS_QUERY_KEY } from "../queries/get-destinations.query"

const $createDestination = apiClient.api.destinations.$post

export const CREATE_DESTINATION_MUTATION_KEY = ["create-destination"] as const

export const useCreateDestination = () => {
  return useMutation({
    mutationKey: CREATE_DESTINATION_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createDestination>["json"]) => {
      const res = await $createDestination({ json: input })
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
        queryKey: [DESTINATIONS_QUERY_KEY],
        exact: false,
      })
    },
  })
}
