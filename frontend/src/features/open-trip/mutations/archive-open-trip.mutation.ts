import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { openTripQueryKeys } from "../queries"

const $archiveOpenTrip = apiClient.api["open-trips"][":id"].archive.$patch

export const ARCHIVE_OPEN_TRIP_MUTATION_KEY = ["archive-open-trip"] as const

export const useArchiveOpenTrip = () => {
  return useMutation({
    mutationKey: ARCHIVE_OPEN_TRIP_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $archiveOpenTrip({ param: { id } })
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
