import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { Suspense } from "react"

import { getArticlesQueryOptions } from "@/features/article/queries"
import { getQueryClient } from "@/lib/query-client"

import { Featured } from "./featured"
import { FeaturedSkeleton } from "./skeleton"

export function ArticleFeaturedSection() {
  const queryClient = getQueryClient()

  queryClient.prefetchInfiniteQuery(
    getArticlesQueryOptions({
      limit: "10",
      featured: "true",
      published: "true",
      sort: "publishedAt",
      order: "desc",
    }),
  )

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-primary text-sm font-medium tracking-wider uppercase">
          Artikel Pilihan
        </span>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<FeaturedSkeleton />}>
            <Featured />
          </Suspense>
        </HydrationBoundary>
      </div>
    </section>
  )
}
