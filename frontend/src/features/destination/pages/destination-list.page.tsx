"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"

import { DestinationDialog } from "../components/dialog"
import { DeleteDestinationDialog } from "../components/dialog/delete"
import { DestinationListFilters } from "../components/list-filter"
import { DestinationTable } from "../components/table"
import { useDestinationListFilters } from "../hooks/use-destination-list-filters"
import { type GetDestinationsQuery } from "../queries"
import { useDestinationDialogStore } from "../stores/destination-dialog.store"

export function DestinationListPage() {
  const openDialog = useDestinationDialogStore((s) => s.onOpen)
  const { query } = useDestinationListFilters()

  const tableQuery: GetDestinationsQuery = {
    limit: "10",
    order: query.order,
    search: query.search || undefined,
    sort: query.sort || undefined,
    cityId: query.cityId || undefined,
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <DestinationListFilters />
        <Button onClick={() => openDialog(null)}>
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={2} />}>
        <DestinationTable query={tableQuery} />
      </Suspense>

      <DestinationDialog />
      <DeleteDestinationDialog />
    </>
  )
}
