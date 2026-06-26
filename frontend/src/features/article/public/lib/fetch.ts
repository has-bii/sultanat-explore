import { apiClient } from "@/lib/api-client"
import { cacheLife } from "next/cache"

import { GetArticlesQuery } from "../../queries"

export const fetchArticleBySlug = async (slug: string) => {
  "use cache"
  cacheLife("hours")

  try {
    const res = await apiClient.api.articles.slug[":slug"].$get({ param: { slug } })

    const resData = await res.json()

    if (!resData.success) return null

    return resData.data
  } catch {
    return null
  }
}

export const fetchPublishedArticles = async ({
  category,
  search,
  cursor,
  limit,
}: Pick<GetArticlesQuery, "category" | "search" | "cursor" | "limit">) => {
  "use cache"
  cacheLife("hours")

  try {
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
  } catch {
    return { data: [], nextCursor: null }
  }
}

export const fetchRelatedArticles = async (slug: string) => {
  "use cache"
  cacheLife("hours")

  try {
    const res = await apiClient.api.articles.slug[":slug"].related.$get({
      param: { slug },
      query: { limit: "3" },
    })
    const resData = await res.json()
    if (!resData.success) return []
    return resData.data
  } catch {
    return []
  }
}

export const fetchFeaturedArticles = async () => {
  "use cache"
  cacheLife("hours")

  try {
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
  } catch {
    return []
  }
}

export const fetchCategory = async () => {
  "use cache"
  cacheLife("hours")
  try {
    const res = await apiClient.api.categories.$get()
    const resData = await res.json()
    if (!resData.success) return []
    return resData.data
  } catch {
    return []
  }
}