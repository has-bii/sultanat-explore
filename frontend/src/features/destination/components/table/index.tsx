"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin, MapPinOff } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { type GetDestinationsQuery, getDestinationsQueryOptions } from "../../queries"
import { DestinationTableRow } from "./row"

interface DestinationTableProps {
  query: GetDestinationsQuery
}

export function DestinationTable({ query }: DestinationTableProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getDestinationsQueryOptions({ ...query, limit: query.limit ?? "10" }),
  )
  const destinations = data.pages.flatMap((p) => p.data)

  if (destinations.length === 0) {
    const hasFilters = query.search || query.featured

    return (
      <TableEmpty
        icon={hasFilters ? MapPinOff : MapPin}
        title={hasFilters ? "Tidak ada hasil" : "Belum ada destinasi"}
        description={
          hasFilters
            ? "Tidak ada destinasi yang cocok."
            : "Buat destinasi pertama untuk mulai membangun konten."
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
          Muat lebih banyak
        </ButtonLoading>
      )}
    </div>
  )
}
