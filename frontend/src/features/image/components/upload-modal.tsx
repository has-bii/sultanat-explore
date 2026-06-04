"use client"

import { Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

import { xhrUpload } from "../lib/upload"
import type { QueueItem } from "./upload-queue-item"
import { UploadQueueItem } from "./upload-queue-item"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function createEmptyQueue(): QueueItem[] {
  return []
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [queue, setQueue] = useState<QueueItem[]>(createEmptyQueue)
  const [isUploading, setIsUploading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  // Reset on close (transition from open -> closed)
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      // Cleanup previews
      setQueue((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.preview))
        return []
      })
      setIsUploading(false)
      abortRef.current?.abort()
      abortRef.current = null
    }
    wasOpenRef.current = open
  }, [open])

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: QueueItem[] = []
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`Tipe file tidak didukung: ${file.name.split(".").pop()}`)
        continue
      }
      if (file.size > MAX_SIZE) {
        toast.error(`File terlalu besar (max 5MB): ${file.name}`)
        continue
      }
      newItems.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        alt: "",
        status: "pending",
        progress: 0,
      })
    }
    setQueue((prev) => [...prev, ...newItems])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (dropRef.current) dropRef.current.classList.remove("border-neutral-900")
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.add("border-neutral-900")
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropRef.current) dropRef.current.classList.remove("border-neutral-900")
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files)
      e.target.value = ""
    },
    [addFiles],
  )

  const updateAlt = (id: string, alt: string) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, alt } : item)))
  }

  const removeItem = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const retryItem = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "pending" as const, progress: 0, error: undefined }
          : item,
      ),
    )
  }

  const uploadAll = async () => {
    setIsUploading(true)
    const controller = new AbortController()
    abortRef.current = controller

    const pendingItems = queue.filter((i) => i.status === "pending" || i.status === "failed")

    for (const item of pendingItems) {
      if (controller.signal.aborted) break

      setQueue((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "uploading", progress: 0 } : i)),
      )

      try {
        await xhrUpload({
          file: item.file,
          alt: item.alt || undefined,
          signal: controller.signal,
          onProgress: (pct) => {
            setQueue((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i)))
          },
        })

        setQueue((prev) => prev.filter((i) => i.id !== item.id))
        toast.success(`Berhasil upload: ${item.file.name}`)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") break
        const message = err instanceof Error ? err.message : "Upload gagal"
        setQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "failed", error: message } : i)),
        )
        toast.error(`Gagal upload: ${item.file.name}`)
      }
    }

    setIsUploading(false)
    abortRef.current = null

    // Check if all done
    const remaining = queue.filter((i) => i.status === "pending" || i.status === "failed")
    if (remaining.length === 0) {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (isUploading) {
      if (confirm("Upload sedang berjalan. Yakin batal?")) {
        abortRef.current?.abort()
        onOpenChange(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  const hasPending = queue.some((i) => i.status === "pending" || i.status === "failed")

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-h-[90vh] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-heading font-heading font-bold">Upload Foto</DialogTitle>
        </DialogHeader>

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
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        {queue.length > 0 && (
          <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: "40vh" }}>
            {queue.map((item) => (
              <UploadQueueItem
                key={item.id}
                item={item}
                onAltChange={updateAlt}
                onRemove={removeItem}
                onRetry={retryItem}
              />
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="rounded-full">
            Batal
          </Button>
          {queue.length > 0 && (
            <Button
              onClick={uploadAll}
              disabled={!hasPending || isUploading}
              className="rounded-full"
            >
              {isUploading ? "Mengupload..." : "Upload semua"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
