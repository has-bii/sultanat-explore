"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { AttractionDialog } from "../components/attraction-dialog"
import { AttractionListFilters } from "../components/attraction-list-filters"
import { AttractionListTable } from "../components/attraction-list-table"
import { AttractionListTableSkeleton } from "../components/attraction-list-table-skeleton"
import { DeleteAttractionDialog } from "../components/delete-attraction-dialog"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"

export function AttractionListPage() {
  const openDialog = useAttractionDialogStore((s) => s.onOpen)

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Toolbar: filters + create button */}
      <div className="flex items-center justify-between gap-2">
        <Suspense fallback={<Skeleton className="h-9 flex-1" />}>
          <AttractionListFilters />
        </Suspense>
        <Button onClick={() => openDialog(null)}>
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      {/* Table */}
      <Suspense fallback={<AttractionListTableSkeleton />}>
        <AttractionListTable />
      </Suspense>

      {/* Dialog (no destinationId — shows destination selector) */}
      <AttractionDialog />
      <DeleteAttractionDialog />
    </div>
  )
}
