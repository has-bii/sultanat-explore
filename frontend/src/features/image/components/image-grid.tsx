"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ImageOff, ImagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { GetImagesQuery, getImagesQueryOptions } from "../queries"
import { useUploadImagesDialogStore } from "../stores/upload-images-dialog.store"
import type { Image as TImage } from "../types"
import { ImageCard } from "./image-card"

interface Props {
  // Params
  query: GetImagesQuery
  onClearSearch: () => void

  // Actions
  onImageClick?: (image: TImage) => void
  onImageCheckedChange?: (image: TImage) => void
  selectedIds?: Set<string>
  selectedId?: string

  // Style
  className?: string
}

export default function ImageGrid(props: Props) {
  const {
    query,
    onClearSearch,
    onImageClick,
    onImageCheckedChange,
    selectedIds,
    selectedId,
    className,
  } = props

  // Fetching images
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    getImagesQueryOptions(query),
  )
  const images = data.pages.flatMap((p) => p.data) ?? []

  // Upload image dialog stores
  const onUpload = useUploadImagesDialogStore((s) => s.onOpen)

  // Empty state — no images at all
  if (images.length === 0 && !query.search) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <ImagePlus className="size-16 text-neutral-300" strokeWidth={1} />
        <div>
          <h3 className="text-heading font-heading text-lg font-bold">Belum ada foto</h3>
          <p className="text-caption mt-1 max-w-sm text-neutral-500">
            Upload foto pertama untuk mulai membangun library
          </p>
        </div>
        <Button onClick={onUpload}>Upload foto</Button>
      </div>
    )
  }

  // Empty state — search no results
  if (images.length === 0 && query.search) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <ImageOff className="size-16 text-neutral-300" strokeWidth={1} />
        <div>
          <h3 className="text-heading font-heading text-lg font-bold">Tidak ada hasil</h3>
          <p className="text-caption mt-1 max-w-sm text-neutral-500">
            Tidak ada foto yang cocok dengan &ldquo;{query.search}&rdquo;
          </p>
        </div>
        <Button onClick={onClearSearch} variant="outline">
          Hapus pencarian
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-2 gap-4 @lg/main:grid-cols-4 @xl/main:grid-cols-5">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={onImageClick}
            isSelected={selectedId ? selectedId === image.id : undefined}
            isChecked={selectedIds?.has(image.id)}
            onCheckedChange={onImageCheckedChange ? () => onImageCheckedChange(image) : undefined}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
            {isFetchingNextPage ? "Memuat..." : "Muat lainnya"}
          </Button>
        </div>
      )}
    </div>
  )
}
