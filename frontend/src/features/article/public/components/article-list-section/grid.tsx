"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { getArticlesQueryOptions } from "@/features/article/queries"
import { parseAsString, useQueryState } from "nuqs"

import { ArticleCard } from "./card"

export function ArticleGrid() {
  const [category] = useQueryState("category")
  const [search] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  )

  const { data } = useSuspenseInfiniteQuery(
    getArticlesQueryOptions({
      limit: "10",
      published: "true",
      order: "desc",
      sort: "publishedAt",
      category: category || undefined,
      search: search || undefined,
    }),
  )

  const articles = data.pages.flatMap((p) => p.data)

  return (
    <>
      {articles.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} data={article} priority={index === 0} />
          ))}
        </div>
      )}
    </>
  )
}
