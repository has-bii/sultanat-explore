import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

const $getCategories = apiClient.api.categories.$get
export type GetCategoriesResponse = InferResponseType<typeof $getCategories, 200>

export const categoryQueryKeys = {
  all: () => ["categories"] as const,
  list: () => [...categoryQueryKeys.all(), "list"] as const,
}

export const getCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: categoryQueryKeys.list(),
    queryFn: async () => {
      const res = await $getCategories()
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
    staleTime: 60_000,
  })
}
