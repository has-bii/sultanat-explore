"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

import { AttractionListFilters } from "../components/attraction-list-filters"
import { AttractionListTableSkeleton } from "../components/attraction-list-table-skeleton"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"
import AttractionDialog from "../components/attraction-dialog"
import { DeleteAttractionDialog } from "../components/delete-attraction-dialog"

const AttractionListTable = dynamic(() => import("../components/attraction-list-table"), {
  ssr: false,
  loading: AttractionListTableSkeleton,
})

export function AttractionListPage() {
  const openDialog = useAttractionDialogStore((s) => s.onOpen)

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Toolbar: filters + create button */}
      <div className="flex items-center gap-2">
        <Suspense>
          <AttractionListFilters />
        </Suspense>
        <Button onClick={() => openDialog(null)}>
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      {/* Table */}
      <AttractionListTable />

      {/* Dialog (no destinationId — shows destination selector) */}
      <AttractionDialog />
      <DeleteAttractionDialog />
    </div>
  )
}
