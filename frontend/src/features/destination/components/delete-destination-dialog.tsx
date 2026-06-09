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

import { useDeleteDestination } from "../mutations/delete-destination.mutation"

interface DeleteDestinationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  destinationId: string
  destinationName: string
  onSuccess: () => void
}

export function DeleteDestinationDialog({
  open,
  onOpenChange,
  destinationId,
  destinationName,
  onSuccess,
}: DeleteDestinationDialogProps) {
  const deleteMutation = useDeleteDestination()

  const handleDelete = () => {
    deleteMutation.mutate(destinationId, {
      onSuccess: () => {
        onOpenChange(false)
        onSuccess()
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Destinasi</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus destinasi &ldquo;{destinationName}&rdquo;? Semua atraksi dan galeri akan ikut
            terhapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
