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
    const hasSearchFilter = Boolean(query.search)

    return (
      <TableEmpty
        icon={hasSearchFilter ? MapPinOff : MapPin}
        title={hasSearchFilter ? "Tidak ada hasil" : "Belum ada destinasi"}
        description={
          hasSearchFilter
            ? "Tidak ditemukan destinasi yang cocok dengan pencarian."
            : "Tambahkan destinasi pertama untuk kota ini."
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
              <TableHead className="pl-4">Nama</TableHead>
              <TableHead className="w-[120px] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.map((destination) => (
              <DestinationTableRow key={destination.id} destination={destination} />
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
