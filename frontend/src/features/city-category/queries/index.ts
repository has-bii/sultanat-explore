import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

const $getCityCategories = apiClient.api["city-categories"].$get
export type GetCityCategoriesResponse = InferResponseType<typeof $getCityCategories, 200>

const $getCityCategory = apiClient.api["city-categories"][":id"].$get
export type GetCityCategoryResponse = InferResponseType<typeof $getCityCategory, 200>

export const cityCategoryQueryKeys = {
  all: () => ["city-categories"] as const,
  list: () => [...cityCategoryQueryKeys.all(), "list"] as const,
  detail: (id: string) => [...cityCategoryQueryKeys.all(), "detail", id] as const,
}

export const getCityCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: cityCategoryQueryKeys.list(),
    queryFn: async () => {
      const res = await $getCityCategories()
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}

export const getCityCategoryQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: cityCategoryQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getCityCategory({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}