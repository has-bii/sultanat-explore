"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"

import { ButtonLoading } from "@/components/button-loading"
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

import { useDeleteCategory } from "../mutations/delete-category.mutation"

interface Props {
  categoryId: string
  categoryName: string
}

export function DeleteCategoryDialog({ categoryId, categoryName }: Props) {
  const [open, setOpen] = useState(false)
  const deleteMutation = useDeleteCategory()

  const handleDelete = () => {
    deleteMutation.mutate(categoryId, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 data-icon="inline-start" />
          <span>Hapus</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus kategori &ldquo;{categoryName}&rdquo;? Artikel yang menggunakan kategori ini tidak
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
