import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { Suspense } from "react"

import { getArticlesQueryOptions } from "@/features/article/queries"
import { getQueryClient } from "@/lib/query-client"
import { SearchParams } from "nuqs/server"

import { fetchCategory, fetchPublishedArticles } from "../../lib/fetch"
import { articleSearchParamsCache } from "../../search-params"
import { ArticleSearch } from "./article-search"
import { ArticleSearchSkeleton } from "./article-search-skeleton"
import { CategoryFilter } from "./category-filter"
import { CategoryFilterSkeleton } from "./category-filter-skeleton"
import { ArticleGrid } from "./grid"
import { ArticleGridSkeleton } from "./grid-skeleton"

interface Props {
  searchParams: Promise<SearchParams>
}

export function ArticleListSection({ searchParams }: Props) {
  const categoryPromise = fetchCategory()

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

          <Suspense fallback={<ArticleSearchSkeleton />}>
            <ArticleSearch />
          </Suspense>
        </div>

        <div className="mt-6">
          <Suspense fallback={<CategoryFilterSkeleton />}>
            <CategoryFilter dataPromise={categoryPromise} />
          </Suspense>
        </div>

        <Suspense fallback={<ArticleGridSkeleton />}>
          <ArticleGridServer searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  )
}

async function ArticleGridServer({ searchParams }: Props) {
  const { search, category } = await articleSearchParamsCache.parse(searchParams)
  const queryClient = getQueryClient()

  const limit = "12"

  queryClient.prefetchInfiniteQuery({
    ...getArticlesQueryOptions({
      limit,
      published: "true",
      category: category || undefined,
      search: search || undefined,
      order: "desc",
      sort: "publishedAt",
    }),
    queryFn: ({ pageParam }) =>
      fetchPublishedArticles({
        limit,
        category: category || undefined,
        search: search || undefined,
        cursor: pageParam,
      }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleGrid />
    </HydrationBoundary>
  )
}
