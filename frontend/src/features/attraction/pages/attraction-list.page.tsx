"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

import AttractionDialog from "../components/attraction-dialog"
import { AttractionListTableSkeleton } from "../components/attraction-list-table-skeleton"
import { DeleteAttractionDialog } from "../components/delete-attraction-dialog"
import { useAttractionDialogStore } from "../stores/attraction-dialog.store"

const AttractionListFilters = dynamic(
  () =>
    import("../components/attraction-list-filters").then((m) => ({
      default: m.AttractionListFilters,
    })),
  { ssr: false, loading: () => <Skeleton className="h-9 flex-1" /> },
)

const AttractionListTable = dynamic(() => import("../components/attraction-list-table"), {
  ssr: false,
  loading: AttractionListTableSkeleton,
})

export function AttractionListPage() {
  const openDialog = useAttractionDialogStore((s) => s.onOpen)

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Toolbar: filters + create button */}
      <div className="flex items-center justify-between gap-2">
        <AttractionListFilters />
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
