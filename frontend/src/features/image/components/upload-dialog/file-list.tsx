import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ItemGroup } from "@/components/ui/item"

import type { UploadItem } from "../../hooks/use-upload-queue"
import { FileListItem } from "./file-list-item"

type Props = {
  items: UploadItem[]
  onRemove: (id: string) => void
  onRetry?: (id: string) => void
  summary: { done: number; failed: number; pending: number }
}

export function FileList({ items, onRemove, onRetry, summary }: Props) {
  if (items.length === 0) return null

  const isUploading = items.some((i) => ["presigning", "uploading", "confirming"].includes(i.status))
  const queuedCount = items.filter((i) => i.status === "queued").length

  return (
    <>
      {/* Alert */}
      {items.length > 10 && (
        <Alert variant="destructive">
          <InfoIcon />
          <AlertTitle>Maksimal 10 Foto</AlertTitle>
          <AlertDescription>Kurangi {items.length - 10} foto untuk melanjutkan</AlertDescription>
        </Alert>
      )}

      {/* Status bar */}
      <div className="bg-accent flex items-center justify-center rounded-sm px-3 py-2.5">
        <p className="text-primary text-sm">
          {isUploading
            ? `Mengunggah ${summary.done + summary.failed + 1} dari ${items.length}`
            : summary.done > 0
              ? `${summary.done} selesai${summary.failed > 0 ? `, ${summary.failed} gagal` : ""}`
              : `${queuedCount} foto yang akan di-upload`}
        </p>
      </div>

      {/* Files list */}
      <ItemGroup className="no-scrollbar max-h-96 overflow-y-auto">
        {items.map((item) => (
          <FileListItem
            key={item.id}
            item={item}
            onRemove={() => onRemove(item.id)}
            onRetry={onRetry ? () => onRetry(item.id) : undefined}
          />
        ))}
      </ItemGroup>
    </>
  )
}