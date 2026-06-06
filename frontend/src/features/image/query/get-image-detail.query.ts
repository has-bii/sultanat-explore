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
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
