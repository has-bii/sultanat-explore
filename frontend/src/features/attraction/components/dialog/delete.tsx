"use client"

import { Trash2 } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useDeleteAttraction } from "../../mutations/delete-attraction.mutation"
import { useDeleteAttractionDialogStore } from "../../stores/delete-attraction-dialog.store"

export function DeleteAttractionDialog() {
  const { open, onClose, meta } = useDeleteAttractionDialogStore()

  const deleteMutation = useDeleteAttraction()

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Atraksi</DialogTitle>
          <DialogDescription>
            Hapus atraksi &ldquo;{meta?.name ?? ""}&rdquo;? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            Batal
          </Button>
          <ButtonLoading
            variant="destructive"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            loadingLabel="Menghapus..."
            icon={Trash2}
          >
            Hapus
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
