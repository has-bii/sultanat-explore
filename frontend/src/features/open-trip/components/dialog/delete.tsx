"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useArchiveOpenTrip } from "../../mutations/archive-open-trip.mutation"
import { useDeleteOpenTrip } from "../../mutations/delete-open-trip.mutation"
import { useOpenTripActionDialogStore } from "../../stores/action-dialog.store"

export function OpenTripActionDialog() {
  const { open, meta, onClose } = useOpenTripActionDialogStore()
  const archiveMutation = useArchiveOpenTrip()
  const deleteMutation = useDeleteOpenTrip()

  const isArchive = meta?.mode === "archive"
  const isPending = isArchive ? archiveMutation.isPending : deleteMutation.isPending

  const handleConfirm = () => {
    if (!meta) return

    const mutation = isArchive ? archiveMutation : deleteMutation
    mutation.mutate(meta.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isArchive ? "Arsipkan Open Trip?" : "Hapus Open Trip Secara Permanen?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isArchive
              ? "Trip tidak akan tampil di halaman publik. Anda dapat memulihkannya nanti."
              : "Tindakan ini tidak dapat dibatalkan. Data open trip akan dihapus secara permanen."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            variant={isArchive ? "default" : "destructive"}
          >
            {isPending
              ? isArchive
                ? "Mengarsipkan..."
                : "Menghapus..."
              : isArchive
                ? "Arsipkan"
                : "Hapus Permanen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
