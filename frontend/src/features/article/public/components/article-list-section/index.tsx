import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { Suspense } from "react"

import { getArticlesQueryOptions } from "@/features/article/queries"
import { getCategoriesQueryOptions } from "@/features/category/queries"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "nuqs/server"

import { articleSearchParamsCache } from "../../search-params"
import { ArticleSearch } from "./article-search"
import { CategoryFilter } from "./category-filter"
import { CategoryFilterSkeleton } from "./category-filter-skeleton"
import { ArticleGrid } from "./grid"
import { ArticleGridSkeleton } from "./grid-skeleton"

type Props = {
  searchParams: Promise<SearchParams>
}

export async function ArticleListSection({ searchParams }: Props) {
  const { category, search } = await articleSearchParamsCache.parse(searchParams)
  const queryClient = getQueryClient()

  queryClient.prefetchQuery(getCategoriesQueryOptions())
  queryClient.prefetchInfiniteQuery(
    getArticlesQueryOptions({
      limit: "10",
      published: "true",
      order: "desc",
      sort: "publishedAt",
      category: category || undefined,
      search: search || undefined,
    }),
  )

  return (
    <section className="pb-16 lg:pb-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Semua Artikel
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-1 font-bold tracking-tight">
              Jelajahi Artikel Kami
            </h2>
          </div>

          {/* Search — client-only nuqs state, non-suspending */}
          <ArticleSearch />
        </div>

        {/* Category filter — per-component Suspense */}
        <div className="mt-6">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<CategoryFilterSkeleton />}>
              <CategoryFilter />
            </Suspense>
          </HydrationBoundary>
        </div>

        {/* Grid — per-component Suspense, streams in from server prefetch */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<ArticleGridSkeleton />}>
            <ArticleGrid />
          </Suspense>
        </HydrationBoundary>
      </div>
    </section>
  )
}
