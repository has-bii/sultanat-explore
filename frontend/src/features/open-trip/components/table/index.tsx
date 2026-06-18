"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { type GetOpenTripsQuery, getOpenTripsQueryOptions } from "../../queries"
import { OpenTripTableRow } from "./row"

interface OpenTripTableProps {
  query: GetOpenTripsQuery
}

export function OpenTripTable({ query }: OpenTripTableProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getOpenTripsQueryOptions({ ...query, limit: query.limit ?? "10" }),
  )
  const openTrips = data.pages.flatMap((p) => p.data)

  if (openTrips.length === 0) {
    const hasFilters = query.status

    return (
      <TableEmpty
        icon={MapPin}
        title={hasFilters ? "Tidak ada hasil" : "Belum ada open trip"}
        description={
          hasFilters
            ? "Coba ubah filter atau kata kunci pencarian."
            : "Buat open trip pertama untuk mulai menawarkan perjalanan."
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="pl-4">Open Trip</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="sr-only">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openTrips.map((openTrip) => (
              <OpenTripTableRow key={openTrip.id} openTrip={openTrip} />
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
          Muat lebih banyak
        </ButtonLoading>
      )}
    </div>
  )
}
