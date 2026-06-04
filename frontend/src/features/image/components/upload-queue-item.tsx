"use client"

import { RotateCcw, X } from "lucide-react"

export interface QueueItem {
  id: string
  file: File
  preview: string
  alt: string
  status: "pending" | "uploading" | "done" | "failed"
  progress: number
  error?: string
}

interface UploadQueueItemProps {
  item: QueueItem
  onAltChange: (id: string, alt: string) => void
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadQueueItem({ item, onAltChange, onRemove, onRetry }: UploadQueueItemProps) {
  const canRemove = item.status === "pending" || item.status === "failed"
  const canRetry = item.status === "failed"

  return (
    <div
      className={`flex gap-3 rounded-lg border p-3 ${
        item.status === "failed" ? "border-red-300 bg-red-50" : "border-neutral-200"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.preview}
        alt={item.file.name}
        className="size-16 shrink-0 rounded object-cover"
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-small-heading truncate text-sm font-medium">{item.file.name}</span>
          <div className="flex items-center gap-1">
            {canRetry && (
              <button
                type="button"
                onClick={() => onRetry(item.id)}
                className="rounded p-1 hover:bg-neutral-100"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
            {canRemove && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="rounded p-1 hover:bg-neutral-100"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
        <span className="text-caption text-neutral-500">{formatFileSize(item.file.size)}</span>
        <input
          type="text"
          value={item.alt}
          onChange={(e) => onAltChange(item.id, e.target.value)}
          placeholder="Alt (opsional)"
          className="h-7 rounded border px-2 text-xs outline-none focus:border-neutral-400"
          disabled={item.status === "uploading" || item.status === "done"}
        />
        {item.status === "uploading" && (
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
        {item.status === "done" && <span className="text-caption text-neutral-500">Selesai</span>}
        {item.status === "failed" && item.error && (
          <span className="text-caption text-red-600">{item.error}</span>
        )}
      </div>
    </div>
  )
}
