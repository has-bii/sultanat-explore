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

import { useDeleteCategory } from "../../mutations/delete-category.mutation"
import { useDeleteCategoryDialogStore } from "../../stores/delete-category-dialog.store"

export function DeleteCategoryDialog() {
  const { open, onClose, meta } = useDeleteCategoryDialogStore()
  const deleteMutation = useDeleteCategory()

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
          <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus kategori &ldquo;{meta?.name ?? ""}&rdquo;? Artikel yang menggunakan kategori ini
            tidak akan terhapus.
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
