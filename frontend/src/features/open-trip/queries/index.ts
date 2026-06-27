import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getOpenTrips = apiClient.api["open-trips"].admin.$get
export type GetOpenTripsQuery = InferRequestType<typeof $getOpenTrips>["query"]
export type GetOpenTripsResponse = InferResponseType<typeof $getOpenTrips, 200>

const $getPublicOpenTrips = apiClient.api["open-trips"].$get
export type GetPublicOpenTripsQuery = InferRequestType<typeof $getPublicOpenTrips>["query"]
export type GetPublicOpenTripsResponse = InferResponseType<typeof $getPublicOpenTrips, 200>

const $getOpenTrip = apiClient.api["open-trips"].admin[":id"].$get
export type GetOpenTripResponse = InferResponseType<typeof $getOpenTrip, 200>

export const openTripQueryKeys = {
  all: () => ["open-trips"] as const,
  list: (query: GetOpenTripsQuery) => [...openTripQueryKeys.all(), query] as const,
  detail: (id: string) => [...openTripQueryKeys.all(), "detail", id] as const,
}

export const getOpenTripsQueryOptions = (query: GetOpenTripsQuery) => {
  return infiniteQueryOptions({
    queryKey: openTripQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getOpenTrips({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetOpenTripsResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const getPublicOpenTripsQueryOptions = (query: GetPublicOpenTripsQuery) => {
  return infiniteQueryOptions({
    queryKey: openTripQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getPublicOpenTrips({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetPublicOpenTripsResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const getOpenTripQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: openTripQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getOpenTrip({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
