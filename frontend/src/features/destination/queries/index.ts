import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getDestinations = apiClient.api.destinations.$get
export type GetDestinationsQuery = InferRequestType<typeof $getDestinations>["query"]
export type GetDestinationsResponse = InferResponseType<typeof $getDestinations, 200>

const $getDestination = apiClient.api.destinations[":id"].$get
export type GetDestinationResponse = InferResponseType<typeof $getDestination, 200>

const $getDestinationGallery = apiClient.api.destinations[":id"].gallery.$get
export type GetDestinationGalleryResponse = InferResponseType<typeof $getDestinationGallery, 200>

export const destinationQueryKeys = {
  all: () => ["destinations"] as const,
  list: (query: GetDestinationsQuery) => [...destinationQueryKeys.all(), query] as const,
  detail: (id: string) => ["destination", id] as const,
  gallery: (id: string) => [...destinationQueryKeys.detail(id), "gallery"] as const,
}

export const getDestinationsQueryOptions = (query: GetDestinationsQuery) => {
  return infiniteQueryOptions({
    queryKey: destinationQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getDestinations({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetDestinationsResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
  })
}

export const getDestinationQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: destinationQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getDestination({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}

export const getDestinationGalleryQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: destinationQueryKeys.gallery(id),
    queryFn: async () => {
      const res = await $getDestinationGallery({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
