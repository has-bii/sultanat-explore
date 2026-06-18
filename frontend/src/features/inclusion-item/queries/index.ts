import type { InferResponseType } from "hono"
import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

const $getInclusionItems = apiClient.api["inclusion-items"].$get

export type GetInclusionItemsResponse = InferResponseType<typeof $getInclusionItems, 200>

export const inclusionItemQueryKeys = {
  all: () => ["inclusion-items"] as const,
  list: () => [...inclusionItemQueryKeys.all(), "list"] as const,
}

export const getInclusionItemsQueryOptions = () => {
  return queryOptions({
    queryKey: inclusionItemQueryKeys.list(),
    queryFn: async () => {
      const res = await $getInclusionItems()
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetInclusionItemsResponse["data"]
    },
  })
}
