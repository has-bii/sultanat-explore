"use client"

import { useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { CityCategoryForm } from "../../components/form"
import { useCityCategoryForm } from "../../hooks/use-city-category-form"
import { useCreateCityCategory } from "../../mutations/create-city-category.mutation"
import { useUpdateCityCategory } from "../../mutations/update-city-category.mutation"
import { useCityCategoryDialogStore } from "../../stores/city-category-dialog.store"

export function CityCategoryDialog() {
  const { open, meta, onClose } = useCityCategoryDialogStore()

  const createMutation = useCreateCityCategory()
  const updateMutation = useUpdateCityCategory()

  const isEdit = meta !== null
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useCityCategoryForm({
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

  // useAppForm reads defaultValues once at mount; the dialog mounts once and
  // reopens with different meta. Re-seed the form whenever it opens so edit
  // pre-fills the current entity and create clears any stale value.
  useEffect(() => {
    if (open) form.reset({ name: meta?.name ?? "" })
  }, [open, form, meta])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kategori Kota" : "Tambah Kategori Kota"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Ubah nama kategori kota" : "Buat kategori baru untuk mengelompokkan kota"}
          </DialogDescription>
        </DialogHeader>
        <CityCategoryForm
          form={form}
          mode={isEdit ? "edit" : "create"}
          isPending={isPending}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
