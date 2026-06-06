import { infiniteQueryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { InferRequestType, InferResponseType } from "hono"

const $getImages = apiClient.api.images.$get
export type GetImagesQuery = InferRequestType<typeof $getImages>["query"]
export type GetImagesResponse = InferResponseType<typeof $getImages, 200>

export const IMAGES_QUERY_KEY = "images" as const

export const getImagesQueryOptions = (query: GetImagesQuery = {}) => {
  return infiniteQueryOptions({
    queryKey: [IMAGES_QUERY_KEY, query],
    queryFn: async ({ pageParam }) => {
      const res = await $getImages({
        query: { ...query, cursor: pageParam },
      })
      const data = await res.json()
      if ("error" in data) throw new Error(data.message)
      return data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
  })
}
