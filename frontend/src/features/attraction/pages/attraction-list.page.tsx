"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"

import { AttractionDialog } from "../components/dialog"
import { DeleteAttractionDialog } from "../components/dialog/delete"
import { AttractionListFilters } from "../components/list-filter"
import { AttractionListTable } from "../components/list-table"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"

export function AttractionListPage() {
  const openDialog = useAttractionDialogStore((s) => s.onOpen)

  return (
    <>
      {/* Toolbar: filters + create button */}
      <div className="flex items-center justify-between gap-2">
        <AttractionListFilters />
        <Button onClick={() => openDialog(null)}>
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      {/* Table */}
      <Suspense fallback={<TableSkeleton rowCount={5} columns={2} />}>
        <AttractionListTable />
      </Suspense>

      {/* Dialog (no destinationId — shows destination selector) */}
      <AttractionDialog />
      <DeleteAttractionDialog />
    </>
  )
}
