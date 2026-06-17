import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

const $getCategories = apiClient.api.categories.$get
export type GetCategoriesResponse = InferResponseType<typeof $getCategories, 200>

const $getCategory = apiClient.api.categories[":id"].$get
export type GetCategoryResponse = InferResponseType<typeof $getCategory, 200>

export const categoryQueryKeys = {
  all: () => ["categories"] as const,
  list: () => [...categoryQueryKeys.all(), "list"] as const,
  detail: (id: string) => [...categoryQueryKeys.all(), "detail", id] as const,
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
  })
}

export const getCategoryQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: categoryQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getCategory({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
