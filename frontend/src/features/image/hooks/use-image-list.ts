"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getImages = apiClient.api.images.$get

export type GetImagesQuery = InferRequestType<typeof $getImages>["query"]
export type GetImagesResponse = InferResponseType<typeof $getImages, 200>

export const IMAGES_QUERY_KEY = "images" as const

export function useImageList(query: Omit<GetImagesQuery, "cursor"> & { cursor?: string }) {
  return useInfiniteQuery({
    queryKey: [IMAGES_QUERY_KEY, query],
    queryFn: async ({ pageParam }) => {
      const res = await $getImages({
        query: { ...query, cursor: pageParam as string | undefined },
      })
      const data = await res.json()
      if ("error" in data) throw new Error(data.message)
      return data as GetImagesResponse
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
  })
}
