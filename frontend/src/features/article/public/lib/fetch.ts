import { cache } from "react"

import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

// Public article by slug — full row incl. content (Tiptap JSON), image, author, category.
type ArticleBySlugResponse = InferResponseType<
  (typeof apiClient.api.articles.slug)[":slug"]["$get"],
  200
>

type ArticleBySlugData = ArticleBySlugResponse["data"]

// Related articles — array of list-included articles.
type RelatedResponse = InferResponseType<
  (typeof apiClient.api.articles.slug)[":slug"]["related"]["$get"],
  200
>

export type ArticleDetail = ArticleBySlugData
export type RelatedArticle = RelatedResponse["data"][number]

// React cache() dedupes per-request (metadata + render calls share one fetch).
export const fetchArticleBySlug = cache(async (slug: string) => {
  try {
    const res = await apiClient.api.articles.slug[":slug"].$get({ param: { slug } })

    const resData = await res.json()

    if (!resData.success) throw new Error(resData.message)

    return resData.data
  } catch {
    return null
  }
})

/**
 * Fetch the first 100 published articles (single request, no cursor walk).
 * Server-only (sitemap/ISR) — never call from client. Returns [] on failure.
 * If article count grows past 100, reintroduce cursor pagination here.
 */
export async function fetchAllPublishedArticles() {
  try {
    const res = await apiClient.api.articles.$get({
      query: { published: "true", limit: "100" },
    })

    const resData = await res.json()

    if (!resData.success) throw new Error(resData.message)

    return resData.data.data
  } catch {
    return []
  }
}

/** Fetch related articles for a given slug. Returns [] on failure. */
export const fetchRelatedArticles = cache(async (slug: string, limit = 3) => {
  try {
    const res = await apiClient.api.articles.slug[":slug"].related.$get({
      param: { slug },
      query: { limit: String(limit) },
    })
    const resData = await res.json()

    if (!resData.success) throw new Error(resData.message)

    return resData.data
  } catch {
    return []
  }
})
