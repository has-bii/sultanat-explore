"use client"

import { Trash2 } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useDeleteInclusionItem } from "../../mutations/delete-inclusion-item.mutation"
import { useDeleteInclusionItemDialogStore } from "../../stores/delete-inclusion-item-dialog.store"

export function DeleteInclusionItemDialog() {
  const { open, onClose, meta } = useDeleteInclusionItemDialogStore()
  const deleteMutation = useDeleteInclusionItem()

  const handleOpenChange = () => {
    if (deleteMutation.isPending) return
    onClose()
  }

  const handleDelete = () => {
    if (!meta?.id) return
    deleteMutation.mutate(meta.id, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Inclusion Item</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus inclusion item &ldquo;{meta?.label ?? ""}&rdquo;? Item yang masih digunakan oleh
            open trip tidak bisa dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
          <ButtonLoading
            variant="destructive"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            loadingLabel="Menghapus..."
            icon={Trash2}
          >
            Hapus
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
