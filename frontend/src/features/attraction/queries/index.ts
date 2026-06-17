import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getAttractions = apiClient.api.attractions.$get

export type GetAttractionsQuery = InferRequestType<typeof $getAttractions>["query"]
export type GetAttractionsResponse = InferResponseType<typeof $getAttractions, 200>

const $getAttraction = apiClient.api.attractions[":id"].$get

export type GetAttractionResponse = InferResponseType<typeof $getAttraction, 200>

export const attractionQueryKeys = {
  all: () => ["attractions"] as const,
  list: (query: GetAttractionsQuery) => [...attractionQueryKeys.all(), query] as const,
  detail: (id: string) => [...attractionQueryKeys.all(), "detail", id] as const,
}

export const getAttractionsQueryOptions = (query: GetAttractionsQuery) => {
  return infiniteQueryOptions({
    queryKey: attractionQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getAttractions({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetAttractionsResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const getAttractionQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: attractionQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getAttraction({
        param: { id },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
