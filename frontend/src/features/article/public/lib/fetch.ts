import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

// Public article by slug — full row incl. content (Tiptap JSON), image, author, category.
type ArticleBySlugResponse = InferResponseType<
  (typeof apiClient.api.articles.slug)[":slug"]["$get"],
  200
>

type ArticleBySlugData = Extract<ArticleBySlugResponse, { success: true }>["data"]

// Related articles — array of list-included articles.
type RelatedResponse = InferResponseType<
  (typeof apiClient.api.articles.slug)[":slug"]["related"]["$get"],
  200
>

type RelatedData = Extract<RelatedResponse, { success: true }>["data"]

export type ArticleDetail = ArticleBySlugData
export type RelatedArticle = RelatedData[number]

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  try {
    const res = await apiClient.api.articles.slug[":slug"].$get({ param: { slug } })
    if (!res.ok) return null
    const json = (await res.json()) as ArticleBySlugResponse
    if (!json.success) return null
    return json.data
  } catch {
    return null
  }
}

/** Fetch related articles for a given slug. Returns [] on failure. */
export async function fetchRelatedArticles(slug: string, limit = 3): Promise<RelatedArticle[]> {
  try {
    const res = await apiClient.api.articles.slug[":slug"].related.$get({
      param: { slug },
      query: { limit: String(limit) },
    })
    if (!res.ok) return []
    const json = (await res.json()) as RelatedResponse
    if (!json.success) return []
    return json.data
  } catch {
    return []
  }
}
