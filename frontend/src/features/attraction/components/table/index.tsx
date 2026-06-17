"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin, MapPinOff } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { type GetAttractionsQuery, getAttractionsQueryOptions } from "../../queries"
import { AttractionTableRow } from "./row"

interface AttractionTableProps {
  query: GetAttractionsQuery
}

export function AttractionTable({ query }: AttractionTableProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getAttractionsQueryOptions({ ...query, limit: query.limit ?? "10" }),
  )

  const attractions = data.pages.flatMap((p) => p.data)

  if (attractions.length === 0) {
    const hasSearchFilter = Boolean(query.search)

    return (
      <TableEmpty
        icon={hasSearchFilter ? MapPinOff : MapPin}
        title={hasSearchFilter ? "Tidak ada hasil" : "Belum ada atraksi"}
        description={
          hasSearchFilter
            ? "Tidak ditemukan atraksi yang cocok dengan pencarian."
            : "Tambahkan atraksi pertama untuk destinasi ini."
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
            {attractions.map((attraction) => (
              <AttractionTableRow key={attraction.id} attraction={attraction} />
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
