import { infiniteQueryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getDestinations = apiClient.api.destinations.$get

export type GetDestinationsQuery = InferRequestType<typeof $getDestinations>["query"]
export type GetDestinationsResponse = InferResponseType<typeof $getDestinations, 200>

export const DESTINATIONS_QUERY_KEY = "destinations" as const

export const getDestinationsQueryOptions = (query: GetDestinationsQuery) => {
  return infiniteQueryOptions({
    queryKey: [DESTINATIONS_QUERY_KEY, query],
    queryFn: async ({ pageParam }) => {
      const res = await $getDestinations({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
  })
}
