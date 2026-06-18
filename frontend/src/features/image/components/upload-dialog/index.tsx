"use client"

import { UploadIcon } from "lucide-react"
import { useEffect, useRef } from "react"

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

import { useUploadQueue } from "../../hooks/use-upload-queue"
import { useUploadImagesDialogStore } from "../../stores/upload-images-dialog.store"
import { DndImages } from "./dnd-images"
import { FileList } from "./file-list"

export function UploadImagesDialog() {
  const { open, onOpenChange } = useUploadImagesDialogStore()
  const { items, addFiles, removeItem, startUpload, retryItem, reset, isUploading, summary } = useUploadQueue()
  const wasOpenRef = useRef(false)

  // Reset on close
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      reset()
    }
    wasOpenRef.current = open
  }, [open, reset])

  const handleClose = () => {
    if (!isUploading) onOpenChange(false)
  }

  const handleSubmit = () => {
    startUpload()
  }

  const canSubmit = items.length > 0 && items.length <= 10 && !isUploading

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Foto</DialogTitle>
          <DialogDescription>
            Foto yang telah di-upload dapat digunakan di gallery, destinasi, dll.
          </DialogDescription>
        </DialogHeader>
        {/* Main */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Dnd component */}
          <DndImages onChange={addFiles} />

          <FileList items={items} onRemove={removeItem} onRetry={retryItem} summary={summary} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Batal
          </Button>
          <ButtonLoading
            onClick={handleSubmit}
            disabled={!canSubmit}
            isLoading={isUploading}
            icon={UploadIcon}
          >
            Upload
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}