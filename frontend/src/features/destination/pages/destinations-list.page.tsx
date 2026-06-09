"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { MapPin, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"

import { DestinationsFilters } from "../components/destinations-filters"
import { DestinationsTable } from "../components/destinations-table"
import { useDestinationFilters } from "../hooks/use-destination-filters"
import { getDestinationsQueryOptions } from "../queries/get-destinations.query"

export function DestinationsListPage() {
  const { search, setSearch, featured, setFeatured, sort, setSort, clearSearch } =
    useDestinationFilters()

  const query = {
    sort: sort as "createdAt" | "name",
    order: (sort === "name" ? "asc" : "desc") as "asc" | "desc",
    ...(search ? { search } : {}),
    ...(featured && featured !== "all" ? { featured: featured as "true" | "false" } : {}),
    limit: "10",
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
    useInfiniteQuery(getDestinationsQueryOptions(query))

  const destinations = data?.pages.flatMap((p) => p.data) ?? []

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Toolbar: filters + create button */}
      <div className="flex flex-wrap items-center gap-2">
        <DestinationsFilters
          search={search}
          onSearchChange={setSearch}
          featured={featured}
          onFeaturedChange={setFeatured}
          sort={sort}
          onSortChange={setSort}
          onClearSearch={clearSearch}
        />
        <Button asChild className="ml-auto rounded-full">
          <Link href="/admin/dashboard/destination/create">
            <Plus className="size-4" />
            Buat Destinasi
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DestinationsTable destinations={destinations} isLoading={isLoading} />

      {/* Empty state */}
      {!isLoading && destinations.length === 0 && (
        <Empty>
          <EmptyMedia variant="icon">
            <MapPin className="size-6" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Belum ada destinasi</EmptyTitle>
            <EmptyDescription>Buat destinasi pertama untuk mulai membangun konten</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="rounded-full">
              <Link href="/admin/dashboard/destination/create">
                <Plus className="size-4" />
                Buat Destinasi
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {/* Pagination */}
      {destinations.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-2">
          <span className="text-caption text-muted-foreground">
            Menampilkan {destinations.length} destinasi
          </span>
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="rounded-full"
            >
              {isFetchingNextPage ? "Memuat..." : "Muat lainnya"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
