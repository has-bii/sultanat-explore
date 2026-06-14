"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { MapPin, MapPinOff } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useAttractionListFilters } from "../hooks/use-attraction-list-filters"
import { type GetAttractionsQuery, getAttractionsQueryOptions } from "../queries"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"
import { useDeleteAttractionDialogStore } from "../stores/delete-attraction-dialog.store"
import { AttractionTableRow } from "./attraction-table-row"

export function AttractionListTable() {
  const openDialog = useAttractionDialogStore((s) => s.onOpen)
  const openDeleteDialog = useDeleteAttractionDialogStore((s) => s.onOpen)
  const { query, methods } = useAttractionListFilters()

  const parsedQuery: GetAttractionsQuery = {
    limit: "10",
    order: query.order,
    search: query.search || undefined,
    sort: query.sort || undefined,
    destinationId: query.destinationId || undefined,
  }

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getAttractionsQueryOptions(parsedQuery),
  )

  const attractions = data.pages.flatMap((p) => p.data)

  // Empty state — search/filter no results
  if (attractions.length === 0 && (query.search || query.destinationId)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinOff />
          </EmptyMedia>
          <EmptyTitle>Tidak ada hasil</EmptyTitle>
          <EmptyDescription>
            Tidak ditemukan atraksi yang cocok dengan filter Anda.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonLoading
            variant="outline"
            onClick={() => {
              methods.onSearchChange("")
              methods.onDestinationChange("")
            }}
            isLoading={false}
          >
            Hapus Filter
          </ButtonLoading>
        </EmptyContent>
      </Empty>
    )
  }

  // Empty state — no attractions at all
  if (attractions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPin />
          </EmptyMedia>
          <EmptyTitle>Belum ada atraksi</EmptyTitle>
          <EmptyDescription>Belum ada atraksi. Tambahkan atraksi pertama.</EmptyDescription>
        </EmptyHeader>
      </Empty>
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
              <AttractionTableRow
                key={attraction.id}
                attraction={attraction}
                onUpdate={(id) => openDialog(id)}
                onDelete={(id, name) => openDeleteDialog({ id, name })}
              />
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
          Tampilkan lebih banyak
        </ButtonLoading>
      )}
    </div>
  )
}
