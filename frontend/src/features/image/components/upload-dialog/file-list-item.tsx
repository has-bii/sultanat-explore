import { CheckCircle2, Loader2, RotateCcw, Trash2, XCircle } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { formatFileSize } from "@/utils/format-file-size"
import Image from "next/image"

import type { UploadItem } from "../../hooks/use-upload-queue"

type Props = {
  item: UploadItem
  onRemove: () => void
  onRetry?: () => void
}

function StatusBadge({
  status,
  progress,
  error,
}: {
  status: UploadItem["status"]
  progress: number
  error?: string
}) {
  switch (status) {
    case "queued":
      return <span className="text-xs text-neutral-400">Menunggu</span>
    case "presigning":
      return (
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <Loader2 className="size-3 animate-spin" />
          Menyiapkan…
        </span>
      )
    case "uploading":
      return (
        <div className="flex w-full max-w-32 flex-col gap-1">
          <Progress value={progress} className="h-1.5" />
          <span className="text-xs text-neutral-500">Mengunggah {progress}%</span>
        </div>
      )
    case "confirming":
      return (
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <Loader2 className="size-3 animate-spin" />
          Menyimpan…
        </span>
      )
    case "done":
      return (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="size-3" />
          Selesai
        </span>
      )
    case "error":
      return (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <XCircle className="size-3" />
          {error ?? "Gagal"}
        </span>
      )
  }
}

export function FileListItem({ item, onRemove, onRetry }: Props) {
  const wasOpenRef = useRef(false)
  const previewUrl = useMemo(() => URL.createObjectURL(item.file), [item.file])

  useEffect(() => {
    if (!wasOpenRef.current) {
      wasOpenRef.current = true
      return
    }

    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const canRemove = item.status === "queued" || item.status === "error"

  return (
    <Item variant="outline" role="listitem">
      <ItemMedia variant="image" className="size-14">
        <Image src={previewUrl} alt="" width={56} height={56} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{item.file.name}</ItemTitle>
        <ItemDescription className="flex flex-col gap-1">
          <span>{formatFileSize(item.file.size)}</span>
        </ItemDescription>
        <StatusBadge status={item.status} progress={item.progress} error={item.error} />
      </ItemContent>
      <ItemActions>
        {canRemove && (
          <Button size="icon-sm" variant="destructive" onClick={onRemove}>
            <Trash2 />
          </Button>
        )}
        {item.status === "error" && onRetry && (
          <Button size="icon-sm" variant="outline" onClick={onRetry}>
            <RotateCcw />
          </Button>
        )}
      </ItemActions>
    </Item>
  )
}
