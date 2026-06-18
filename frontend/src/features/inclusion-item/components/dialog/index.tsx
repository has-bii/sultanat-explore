"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { InclusionItemForm } from "../form"
import { useInclusionItemForm } from "../../hooks/use-inclusion-item-form"
import { useCreateInclusionItem } from "../../mutations/create-inclusion-item.mutation"
import { useUpdateInclusionItem } from "../../mutations/update-inclusion-item.mutation"
import { useInclusionItemDialogStore } from "../../stores/inclusion-item-dialog.store"

export function InclusionItemDialog() {
  const { open, meta, onClose } = useInclusionItemDialogStore()

  const createMutation = useCreateInclusionItem()
  const updateMutation = useUpdateInclusionItem()

  const isEdit = meta !== null
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useInclusionItemForm({
    defaultValues: {
      label: meta?.label ?? "",
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
          <DialogTitle>{isEdit ? "Edit Inclusion Item" : "Tambah Inclusion Item"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Ubah label inclusion item" : "Buat inclusion item baru untuk open trip"}
          </DialogDescription>
        </DialogHeader>
        <InclusionItemForm
          form={form}
          mode={isEdit ? "edit" : "create"}
          isPending={isPending}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
