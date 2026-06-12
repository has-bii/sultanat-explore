import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"

import { destinationQueryKeys } from "../queries"

const $deleteDestination = apiClient.api.destinations[":id"].$delete

export const DELETE_DESTINATION_MUTATION_KEY = ["delete-destination"] as const

export const useDeleteDestination = () => {
  return useMutation({
    mutationKey: DELETE_DESTINATION_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteDestination({ param: { id } })
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
        queryKey: destinationQueryKeys.all(),
        exact: false,
      })
    },
  })
}
