"use client"

import { Plus } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"

import { InclusionItemDialog } from "../components/dialog"
import { DeleteInclusionItemDialog } from "../components/dialog/delete"
import { InclusionItemTable } from "../components/table"
import { useInclusionItemDialogStore } from "../stores/inclusion-item-dialog.store"

export function InclusionItemListPage() {
  const open = useInclusionItemDialogStore((s) => s.onOpen)

  return (
    <>
      <div className="flex items-center justify-end">
        <Button onClick={() => open(null)} className="shrink-0">
          <Plus data-icon="inline-start" />
          <span>Tambah</span>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={5} columns={4} />}>
        <InclusionItemTable />
      </Suspense>

      <InclusionItemDialog />
      <DeleteInclusionItemDialog />
    </>
  )
}
