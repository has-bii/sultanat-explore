import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType, InferResponseType } from "hono"

const $getArticles = apiClient.api.articles.$get
export type GetArticlesQuery = InferRequestType<typeof $getArticles>["query"]
export type GetArticlesResponse = InferResponseType<typeof $getArticles, 200>

const $getArticle = apiClient.api.articles[":id"].$get
export type GetArticleResponse = InferResponseType<typeof $getArticle, 200>

export const articleQueryKeys = {
  all: () => ["articles"] as const,
  list: (query: GetArticlesQuery) => [...articleQueryKeys.all(), query] as const,
  detail: (id: string) => [...articleQueryKeys.all(), "detail", id] as const,
}

export const getArticlesQueryOptions = (query: GetArticlesQuery) => {
  return infiniteQueryOptions({
    queryKey: articleQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getArticles({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetArticlesResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const getArticleQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: articleQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getArticle({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
