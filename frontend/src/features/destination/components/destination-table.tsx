"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin, MapPinOff, Plus } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

import { useDestinationFilters } from "../hooks/use-destination-filters"
import { GetDestinationsQuery, getDestinationsQueryOptions } from "../queries"
import { DestinationTableRow } from "./destination-table-row"

export function DestinationTable() {
  const { query, methods } = useDestinationFilters()

  const parsedQuery: GetDestinationsQuery = {
    limit: "10",
    featured: query.featured || undefined,
    order: query.order,
    search: query.search || undefined,
    sort: query.sort || undefined,
  }

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getDestinationsQueryOptions(parsedQuery),
  )
  const destinations = data.pages.flatMap((p) => p.data)

  // Empty state — search no results
  if (destinations.length === 0 && (query.search || query.featured)) {
    return <EmptyDestinationsWithFilters onClearSearch={() => methods.onSearchChange("")} />
  }

  // Empty state — no destinations at all
  if (destinations.length === 0) {
    return <EmptyDestinations />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="pl-4">Destinasi</TableHead>
              <TableHead>Tagline</TableHead>
              <TableHead className="text-center">Unggulan</TableHead>
              <TableHead className="text-center">Atraksi</TableHead>
              <TableHead className="text-center">Galeri</TableHead>
              <TableHead className="sr-only">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.map((dest) => (
              <DestinationTableRow key={dest.id} dest={dest} />
            ))}
          </TableBody>
        </Table>
      </div>
      {hasNextPage && (
        <ButtonLoading
          size="lg"
          className="mx-auto w-fit"
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          Muat lagi
        </ButtonLoading>
      )}
    </div>
  )
}

function EmptyDestinations() {
  return (
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
            <Plus data-icon="inline-start" />
            <span>Buat Destinasi</span>
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function EmptyDestinationsWithFilters({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <MapPinOff className="size-16 text-neutral-300" strokeWidth={1} />
      <div>
        <h3 className="text-heading font-heading text-lg font-bold">Tidak ada hasil</h3>
        <p className="text-caption mt-1 max-w-sm text-neutral-500">
          Tidak ada destinasi yang cocok
        </p>
      </div>
      <Button onClick={onClearSearch} variant="outline">
        Hapus pencarian
      </Button>
    </div>
  )
}
