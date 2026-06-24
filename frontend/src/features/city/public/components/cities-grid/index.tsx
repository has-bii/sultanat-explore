import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { Suspense } from "react"

import { getCitiesQueryOptions } from "@/features/city/queries"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "nuqs/server"

import { fetchCityCategories } from "../../lib/fetch"
import { destinationSearchParamsCache } from "../../search-params"
import { CategoryFilter } from "./category-filter"
import { CategoryFilterSkeleton } from "./category-filter-skeleton"
import { CitySearch } from "./city-search"
import { CitiesGrid } from "./grid"
import { CitiesGridSkeleton } from "./grid-skeleton"

type Props = {
  searchParams: Promise<SearchParams>
}

export async function CitiesGridSection({ searchParams }: Props) {
  const { category, search } = await destinationSearchParamsCache.parse(searchParams)
  const queryClient = getQueryClient()

  queryClient.prefetchInfiniteQuery(
    getCitiesQueryOptions({
      limit: "100",
      sort: "name",
      order: "asc",
      category: category || undefined,
      search: search || undefined,
    }),
  )

  const cityCategoriesPromise = fetchCityCategories()

  return (
    <section className="border-y py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:mb-16">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Semua Kota
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
              Jelajahi Berdasarkan Kategori
            </h2>
            <p className="text-body text-muted-foreground mt-3 max-w-lg">
              Temukan kota yang sesuai dengan minat Anda — budaya, alam, atau pantai.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <span className="sr-only">Filter kota</span>
            <CitySearch />
          </div>
        </div>

        {/* Category filter — per-component Suspense */}
        <div className="mt-6">
          <Suspense fallback={<CategoryFilterSkeleton />}>
            <CategoryFilter dataPromise={cityCategoriesPromise} />
          </Suspense>
        </div>

        {/* Grid — per-component Suspense, streams in from server prefetch */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<CitiesGridSkeleton />}>
            <CitiesGrid />
          </Suspense>
        </HydrationBoundary>
      </div>
    </section>
  )
}
