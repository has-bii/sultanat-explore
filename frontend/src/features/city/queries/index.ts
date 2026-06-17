import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getCities = apiClient.api.cities.$get
export type GetCitiesQuery = InferRequestType<typeof $getCities>["query"]
export type GetCitiesResponse = InferResponseType<typeof $getCities, 200>

const $getCity = apiClient.api.cities[":id"].$get
export type GetCityResponse = InferResponseType<typeof $getCity, 200>

const $getCityGallery = apiClient.api.cities[":id"].gallery.$get
export type GetCityGalleryResponse = InferResponseType<typeof $getCityGallery, 200>

export const cityQueryKeys = {
  all: () => ["cities"] as const,
  list: (query: GetCitiesQuery) => [...cityQueryKeys.all(), query] as const,
  detail: (id: string) => [...cityQueryKeys.all(), "detail", id] as const,
  gallery: (id: string) => [...cityQueryKeys.detail(id), "gallery"] as const,
}

export const getCitiesQueryOptions = (query: GetCitiesQuery) => {
  return infiniteQueryOptions({
    queryKey: cityQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getCities({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetCitiesResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const getCityQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: cityQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getCity({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}

export const getCityGalleryQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: cityQueryKeys.gallery(id),
    queryFn: async () => {
      const res = await $getCityGallery({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
