import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { InferResponseType } from "hono"

const $getImageDetail = apiClient.api.images[":id"].$get
export type GetImageDetailResponse = InferResponseType<typeof $getImageDetail, 200>

export const IMAGE_QUERY_KEY = "image" as const

export const getImageDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [IMAGE_QUERY_KEY, id],
    queryFn: async () => {
      const res = await $getImageDetail({
        param: { id },
      })
      const data = await res.json()
      if ("error" in data) throw new Error(data.message)
      return data
    },
  })
}
