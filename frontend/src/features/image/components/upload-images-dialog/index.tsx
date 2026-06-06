import { Loader, Send, Upload } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldError, FieldSet } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

import type { UploadImageInput } from "backend/modules/image/image.schema"

import { useUploadImageForm } from "../../hooks/use-upload-image-form"
import { useUploadImagesDialogStore } from "../../stores/upload-images-dialog.store"
import { UploadQueueItem } from "./upload-queue-item"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

export function UploadImagesDialog() {
  const { form, mutation } = useUploadImageForm()
  const { open, onOpenChange } = useUploadImagesDialogStore()
  const dropRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  // Reset on close
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      form.reset()
    }
    wasOpenRef.current = open
  }, [form, open])

  const addFiles = (files: FileList | File[]) => {
    const newQueues: Array<UploadImageInput> = []
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`Tipe file tidak didukung: ${file.name.split(".").pop()}`)
        continue
      }
      if (file.size > MAX_SIZE) {
        toast.error(`File terlalu besar (max 5MB): ${file.name}`)
        continue
      }
      newQueues.push({
        file,
        alt: "",
      })
    }
    form.setFieldValue("queue", (values) => [...values, ...newQueues])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.remove("border-neutral-900")
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.add("border-neutral-900")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.remove("border-neutral-900")
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files) addFiles(e.target.files)
    }
    e.target.value = ""
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-h-[90vh] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Foto</DialogTitle>
          <DialogDescription>
            Foto yang telah di-upload dapat digunakan di gallery, destinasi, dll.
          </DialogDescription>
        </DialogHeader>
        {/* Main */}
        <form
          id="upload-images-form"
          className="flex flex-col gap-4 overflow-hidden"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* DnD Element */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("file-input")?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 p-8 text-center transition-colors hover:border-neutral-400"
          >
            <Upload className="size-8 text-neutral-400" strokeWidth={1.5} />
            <p className="text-sm text-neutral-600">Drop files here atau klik</p>
            <p className="text-caption text-neutral-400">JPG, PNG, WebP (max 5MB each)</p>
          </div>

          {/* Queue List */}
          <form.Field name="queue" mode="array">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet className="gap-4">
                  <ScrollArea className="max-h-96 w-full overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {field.state.value.map((_, index) => (
                        <UploadQueueItem
                          key={index}
                          index={index}
                          form={form}
                          handleRemove={() => field.removeValue(index)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.Field>

          {/* Input file */}
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button
                form="upload-images-form"
                type="submit"
                disabled={!canSubmit || mutation.isPending}
              >
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
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
