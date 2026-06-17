import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getImageDetail = apiClient.api.images[":id"].$get
export type GetImageDetailResponse = InferResponseType<typeof $getImageDetail, 200>

const $getImages = apiClient.api.images.$get
export type GetImagesQuery = InferRequestType<typeof $getImages>["query"]
export type GetImagesResponse = InferResponseType<typeof $getImages, 200>

export const imageQueryKeys = {
  all: () => ["images"] as const,
  list: (query: GetImagesQuery) => [...imageQueryKeys.all(), query] as const,
  detail: (id: string) => [...imageQueryKeys.all(), "detail", id] as const,
}

export const getImagesQueryOptions = (query: GetImagesQuery) => {
  return infiniteQueryOptions({
    queryKey: imageQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getImages({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const getImageDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: imageQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getImageDetail({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
