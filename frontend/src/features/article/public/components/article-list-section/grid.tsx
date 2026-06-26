"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { Loader, Newspaper } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getArticlesQueryOptions } from "@/features/article/queries"
import { parseAsString, useQueryStates } from "nuqs"

import { ArticleCard } from "./card"

export function ArticleGrid() {
  const [{ category, search }] = useQueryStates({
    category: parseAsString,
    search: parseAsString,
  })

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
    ...getArticlesQueryOptions({
      limit: "12",
      published: "true",
      category: category || undefined,
      search: search || undefined,
      order: "desc",
      sort: "publishedAt",
    }),
  })

  const articles = data.pages.flatMap((p) => p.data)
  const isFiltered = Boolean(category || search)

  if (articles.length === 0) {
    return (
      <div className="mt-8">
        <Empty>
          <EmptyMedia variant="icon">
            <Newspaper />
          </EmptyMedia>
          <EmptyTitle>Belum ada artikel</EmptyTitle>
          <EmptyDescription>
            {isFiltered
              ? "Tidak ada artikel yang cocok. Coba ubah filter atau kata kunci pencarian Anda."
              : "Artikel akan segera hadir. Nantikan kembali nanti."}
          </EmptyDescription>
        </Empty>
      </div>
    )
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} data={article} priority={index === 0} />
        ))}
      </div>
      {hasNextPage && (
        <div className="mt-4 flex items-center justify-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} size="lg">
            {isFetchingNextPage && <Loader data-icon="inline-start" className="animate-spin" />}
            Muat lainnya
          </Button>
        </div>
      )}
    </>
  )
}
