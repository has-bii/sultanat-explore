"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { CategoryForm } from "../../components/form"
import { useCategoryForm } from "../../hooks/use-category-form"
import { useCreateCategory } from "../../mutations/create-category.mutation"
import { useUpdateCategory } from "../../mutations/update-category.mutation"
import { useCategoryDialogStore } from "../../stores/category-dialog.store"

export function CategoryDialog() {
  const { open, meta, onClose } = useCategoryDialogStore()

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const isEdit = meta !== null
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useCategoryForm({
    defaultValues: {
      name: meta?.name ?? "",
    },
    onSubmit: async (value) => {
      if (isEdit) {
        updateMutation.mutate({ id: meta.id, input: value }, { onSuccess: () => onClose() })
      } else {
        createMutation.mutate(value, { onSuccess: () => onClose() })
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Ubah nama kategori" : "Buat kategori baru untuk artikel"}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          form={form}
          mode={isEdit ? "edit" : "create"}
          isPending={isPending}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
