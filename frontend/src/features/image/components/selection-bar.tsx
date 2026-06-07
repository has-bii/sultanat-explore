"use client"

import { Button } from "@/components/ui/button"

import { useImageSelectionStore } from "../stores/image-selection.store"
import { BulkDeleteDialog } from "./bulk-delete-dialog"

interface SelectionBarProps {
  allImageIds: string[]
}

export function SelectionBar({ allImageIds }: SelectionBarProps) {
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const toggleAll = useImageSelectionStore((s) => s.toggleAll)

  const count = selectedIds.size
  if (count === 0) return null

  const allSelected = allImageIds.length > 0 && allImageIds.every((id) => selectedIds.has(id))

  return (
    <div className="bg-accent flex items-center justify-between rounded-lg border px-4 py-2">
      <span className="text-muted-foreground text-sm">{count} Foto dipilih</span>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => toggleAll(allImageIds)}>
          {allSelected ? "Batalkan pilihan" : "Pilih semua"}
        </Button>
        <BulkDeleteDialog />
      </div>
    </div>
  )
}
