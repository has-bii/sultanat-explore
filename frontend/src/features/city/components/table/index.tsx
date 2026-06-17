"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin, MapPinOff } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { TableEmpty } from "@/components/table-empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { type GetCitiesQuery, getCitiesQueryOptions } from "../../queries"
import { CityTableRow } from "./row"

interface CityTableProps {
  query: GetCitiesQuery
}

export function CityTable({ query }: CityTableProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getCitiesQueryOptions({ ...query, limit: query.limit ?? "10" }),
  )
  const cities = data.pages.flatMap((p) => p.data)

  if (cities.length === 0) {
    const hasFilters = query.search || query.featured

    return (
      <TableEmpty
        icon={hasFilters ? MapPinOff : MapPin}
        title={hasFilters ? "Tidak ada hasil" : "Belum ada kota"}
        description={
          hasFilters
            ? "Tidak ada kota yang cocok."
            : "Buat kota pertama untuk mulai membangun konten."
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
              <TableHead className="pl-4">Kota</TableHead>
              <TableHead>Tagline</TableHead>
              <TableHead className="text-center">Unggulan</TableHead>
              <TableHead className="text-center">Destinasi</TableHead>
              <TableHead className="text-center">Galeri</TableHead>
              <TableHead className="sr-only">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((dest) => (
              <CityTableRow key={dest.id} dest={dest} />
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
