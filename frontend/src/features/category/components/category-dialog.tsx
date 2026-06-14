"use client"

import { useAppForm } from "@/lib/form"
import { createDialogStore } from "@/hooks/create-dialog-store"
import { useCreateCategory } from "../mutations/create-category.mutation"
import { useUpdateCategory } from "../mutations/update-category.mutation"
import * as v from "valibot"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, Plus } from "lucide-react"

export const useCategoryDialogStore = createDialogStore<{ id: string; name: string }>()

const categorySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
})

export function CategoryDialog() {
  const { open, meta, onClose } = useCategoryDialogStore()

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const isEdit = meta !== null
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useAppForm({
    defaultValues: {
      name: meta?.name ?? "",
    },
    validators: {
      onChange: categorySchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        updateMutation.mutate(
          { id: meta.id, input: value },
          { onSuccess: () => onClose() },
        )
      } else {
        createMutation.mutate(value, {
          onSuccess: () => onClose(),
        })
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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Nama Kategori" placeholder="Travel Tips" />
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
              Batal
            </Button>
            <form.AppForm>
              <form.SubmitButton
                label={isEdit ? "Simpan" : "Tambah"}
                pendingLabel="Menyimpan..."
                isDisabled={isPending}
                icon={isEdit ? Save : Plus}
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
