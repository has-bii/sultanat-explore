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

import { useDeleteCityCategory } from "../../mutations/delete-city-category.mutation"
import { useDeleteCityCategoryDialogStore } from "../../stores/delete-city-category-dialog.store"

export function DeleteCityCategoryDialog() {
  const { open, onClose, meta } = useDeleteCityCategoryDialogStore()
  const deleteMutation = useDeleteCityCategory()

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
          <AlertDialogTitle>Hapus Kategori Kota</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus kategori &ldquo;{meta?.name ?? ""}&rdquo;? Kota yang menggunakan kategori ini tidak
            akan terhapus.
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