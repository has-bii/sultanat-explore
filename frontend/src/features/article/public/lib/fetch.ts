import { apiClient } from "@/lib/api-client"

import { GetArticlesQuery } from "../../queries"

export const fetchArticleBySlug = async (slug: string) => {
  "use cache"

  const res = await apiClient.api.articles.slug[":slug"].$get({ param: { slug } })

  const resData = await res.json()

  if (!resData.success) return null

  return resData.data
}

export const fetchPublishedArticles = async ({
  category,
  search,
  cursor,
  limit,
}: Pick<GetArticlesQuery, "category" | "search" | "cursor" | "limit">) => {
  "use cache"

  const res = await apiClient.api.articles.$get({
    query: {
      published: "true",
      order: "desc",
      sort: "publishedAt",
      limit,
      category,
      search,
      cursor,
    },
  })

  const resData = await res.json()

  if (!resData.success) return { data: [], nextCursor: null }

  return resData.data
}

export const fetchRelatedArticles = async (slug: string) => {
  "use cache"

  const res = await apiClient.api.articles.slug[":slug"].related.$get({
    param: { slug },
    query: { limit: "3" },
  })
  const resData = await res.json()
  if (!resData.success) return []
  return resData.data
}

export const fetchFeaturedArticles = async () => {
  "use cache"

  const res = await apiClient.api.articles.$get({
    query: {
      limit: "5",
      featured: "true",
      published: "true",
      sort: "publishedAt",
      order: "desc",
    },
  })
  const resData = await res.json()
  if (!resData.success) return []
  return resData.data.data
}

export const fetchCategory = async () => {
  "use cache"
  const res = await apiClient.api.categories.$get()
  const resData = await res.json()
  if (!resData.success) return []
  return resData.data
}
