"use client"

import { InfoIcon, Loader, Trash2Icon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { useBulkDeleteImages } from "../mutations/bulk-delete-images.mutation"
import { useImageSelectionStore } from "../stores/image-selection.store"

export function BulkDeleteDialog() {
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const clearSelection = useImageSelectionStore((s) => s.clear)

  const count = selectedIds.size
  const ids = Array.from(selectedIds)

  const { mutateAsync, isPending, error } = useBulkDeleteImages({
    onSuccess: () => {
      clearSelection()
    },
  })

  const handleConfirm = () => {
    if (count === 0) return
    toast.promise(async () => mutateAsync(ids), {
      loading: `Menghapus ${count} foto...`,
      success: (res) => res.message,
      error: (err: Error) => err.message,
    })
  }

  return (
    <AlertDialog>
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
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleConfirm}>
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              `Hapus (${count})`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
