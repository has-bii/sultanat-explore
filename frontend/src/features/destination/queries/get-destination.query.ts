import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

const $getDestination = apiClient.api.destinations[":id"].$get

export type GetDestinationResponse = InferResponseType<typeof $getDestination, 200>

export const DESTINATION_QUERY_KEY = "destination" as const

export const getDestinationQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [DESTINATION_QUERY_KEY, id],
    queryFn: async () => {
      const res = await $getDestination({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
