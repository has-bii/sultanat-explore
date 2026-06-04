import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { InferRequestType, InferResponseType } from "hono"

const $getImages = apiClient.api.images.$get
export type GetImagesQuery = InferRequestType<typeof $getImages>["query"]
export type GetImagesResponse = InferResponseType<typeof $getImages, 200>

export const IMAGES_QUERY_KEY = "images" as const

export const getImagesQueryOptions = (query: GetImagesQuery = {}) => {
  return queryOptions({
    queryKey: [IMAGES_QUERY_KEY, query],
    queryFn: async () => {
      const res = await $getImages({
        query,
      })

      const resData = await res.json()

      if ("error" in resData) {
        throw new Error(resData.message)
      }

      return resData
    },
  })
}
