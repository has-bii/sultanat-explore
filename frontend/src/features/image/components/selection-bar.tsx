"use client"

import { Button } from "@/components/ui/button"

import { useImageSelectionStore } from "../stores/image-selection.store"
import { BulkDeleteDialog } from "./bulk-delete-dialog"

export function SelectionBar() {
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const clear = useImageSelectionStore((s) => s.clear)

  const count = selectedIds.size

  if (count === 0) return null

  return (
    <div className="bg-accent flex items-center justify-between rounded-4xl border px-3 py-2">
      <span className="text-muted-foreground text-sm">{count} Foto dipilih</span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="link" onClick={clear}>
          Batalkan pilihan
        </Button>
        <BulkDeleteDialog />
      </div>
    </div>
  )
}
