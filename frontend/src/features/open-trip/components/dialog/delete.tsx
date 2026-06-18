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

import { useDeleteOpenTrip } from "../../mutations/delete-open-trip.mutation"
import { useDeleteOpenTripDialogStore } from "../../stores/delete-open-trip-dialog.store"

export function DeleteOpenTripDialog() {
  const { open, meta, onClose } = useDeleteOpenTripDialogStore()
  const { mutate, isPending } = useDeleteOpenTrip()

  const handleDelete = () => {
    if (!meta) return
    mutate(meta, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Open Trip?</AlertDialogTitle>
          <AlertDialogDescription>
            Open trip akan diarsipkan (soft delete). Anda dapat memulihkannya nanti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
