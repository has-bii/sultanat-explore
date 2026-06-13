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

import { useDeleteAttraction } from "../mutations/delete-attraction.mutation"
import { useDeleteAttractionDialogStore } from "../stores/delete-attraction-dialog.store"

export function DeleteAttractionDialog() {
  const { open, onClose, selectedAttractionId, selectedAttractionName } =
    useDeleteAttractionDialogStore()

  const deleteMutation = useDeleteAttraction()

  const handleOpenChange = () => {
    if (deleteMutation.isPending) return
    onClose()
  }

  const handleDelete = () => {
    if (!selectedAttractionId) return
    deleteMutation.mutate(selectedAttractionId, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Atraksi</DialogTitle>
          <DialogDescription>
            Hapus atraksi &ldquo;{selectedAttractionName ?? ""}&rdquo;? Tindakan ini tidak dapat
            dibatalkan.
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
          >
            <Trash2 data-icon="inline-start" />
            <span>Hapus</span>
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
