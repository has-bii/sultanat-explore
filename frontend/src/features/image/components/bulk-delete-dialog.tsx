"use client"

import { InfoIcon, Loader, Trash2, Trash2Icon } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { useBulkDeleteImages } from "../mutations/bulk-delete-images.mutation"
import { useImageSelectionStore } from "../stores/image-selection.store"

export function BulkDeleteDialog() {
  const [open, setOpen] = useState(false)
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const clearSelection = useImageSelectionStore((s) => s.clear)

  const count = selectedIds.size

  const { mutate, isPending, error } = useBulkDeleteImages()

  const handleConfirm = () => {
    if (count === 0) return
    mutate(Array.from(selectedIds), {
      onSuccess: () => {
        setOpen(false)
        clearSelection()
      },
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(state) => {
        if (isPending) return
        setOpen(state)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon className="size-4" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus foto</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus {count} foto yang dipilih? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Gagal menghapus foto</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <Button variant="destructive" disabled={isPending} onClick={handleConfirm}>
            {isPending ? (
              <>
                <Loader className="animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 />
                <span>Hapus</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
