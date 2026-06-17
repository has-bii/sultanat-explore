"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"

import { AttractionDialog } from "../components/dialog"
import { DeleteAttractionDialog } from "../components/dialog/delete"
import { AttractionListFilters } from "../components/list-filter"
import { AttractionTable } from "../components/table"
import { useAttractionListFilters } from "../hooks/use-attraction-list-filters"
import { type GetAttractionsQuery } from "../queries"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"

export function AttractionListPage() {
  const openDialog = useAttractionDialogStore((s) => s.onOpen)
  const { query } = useAttractionListFilters()

  const tableQuery: GetAttractionsQuery = {
    limit: "10",
    order: query.order,
    search: query.search || undefined,
    sort: query.sort || undefined,
    destinationId: query.destinationId || undefined,
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <AttractionListFilters />
        <Button onClick={() => openDialog(null)}>
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={2} />}>
        <AttractionTable query={tableQuery} />
      </Suspense>

      <AttractionDialog />
      <DeleteAttractionDialog />
    </>
  )
}
