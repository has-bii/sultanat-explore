import { Loader, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useUploadImages } from "../../mutations/upload-images.mutation"
import { useUploadImagesDialogStore } from "../../stores/upload-images-dialog.store"
import { DndImages } from "./dnd-images"
import FileList from "./file-list"

export function UploadImagesDialog() {
  const { open, onOpenChange } = useUploadImagesDialogStore()
  const mutation = useUploadImages()
  const [files, setFiles] = useState<Map<string, File>>(new Map())
  const wasOpenRef = useRef(false)

  // Reset on close
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setFiles(new Map())
    }
    wasOpenRef.current = open
  }, [open])

  const handleRemove = (fileName: string) => {
    setFiles((prev) => {
      const next = new Map(prev)
      next.delete(fileName)
      return next
    })
  }

  const handleClose = () => {
    if (!mutation.isPending) onOpenChange(false)
  }

  const handleSubmit = () => {
    const mutateInput = Array.from(files.values())
    mutation.mutate({ files: mutateInput }, { onSuccess: () => onOpenChange(false) })
  }

  const canSubmit = files.size > 0 && files.size <= 10

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
          <DndImages onChange={setFiles} />

          <FileList files={files} onRemove={handleRemove} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending || !canSubmit}>
            {mutation.isPending ? (
              <>
                <span>Mengupload...</span>
                <Loader className="animate-spin" />
              </>
            ) : (
              <>
                <span>Upload semua</span>
                <Send />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
