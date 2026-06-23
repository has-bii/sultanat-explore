"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { getArticlesQueryOptions } from "@/features/article/queries"

import { FeaturedCarousel } from "./carousel"
import { FeaturedEmpty } from "./empty"

export function Featured() {
  const { data } = useSuspenseInfiniteQuery(
    getArticlesQueryOptions({
      limit: "10",
      featured: "true",
      published: "true",
      sort: "publishedAt",
      order: "desc",
    }),
  )

  const articles = data.pages.flatMap((p) => p.data)

  if (articles.length === 0) {
    return <FeaturedEmpty />
  }

  return <FeaturedCarousel articles={articles} />
}