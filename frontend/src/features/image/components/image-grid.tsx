"use client"

import { ImageOff, ImagePlus, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import type { Image } from "../dto/image.schema"
import { useUploadImagesDialogStore } from "../stores/upload-images-dialog.store"
import { ImageCard } from "./image-card"

interface ImageGridProps {
  images: Image[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  search: string
  onLoadMore: () => void
  onImageClick: (image: Image) => void
  onClearSearch: () => void
  mode?: "view" | "pick"
  onPick?: (image: Image) => void
  selectedId?: string | null
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <Skeleton className="aspect-square" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ImageGrid({
  images,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  search,
  onLoadMore,
  onImageClick,
  onClearSearch,
  mode = "view",
  onPick,
  selectedId,
}: ImageGridProps) {
  const onUpload = useUploadImagesDialogStore((s) => s.onOpen)

  // Mobile gate
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <Monitor className="size-16 text-neutral-300" strokeWidth={1} />
        <div>
          <h3 className="text-heading font-heading text-lg font-bold">Gunakan Desktop</h3>
          <p className="text-caption mt-1 max-w-sm text-neutral-500">
            Manajemen foto optimal di layar desktop. Silakan buka di perangkat dengan layar lebih
            besar.
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) return <SkeletonGrid />

  // Empty state — no images at all
  if (images.length === 0 && !search) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <ImagePlus className="size-16 text-neutral-300" strokeWidth={1} />
        <div>
          <h3 className="text-heading font-heading text-lg font-bold">Belum ada foto</h3>
          <p className="text-caption mt-1 max-w-sm text-neutral-500">
            Upload foto pertama untuk mulai membangun library
          </p>
        </div>
        <Button onClick={onUpload} className="rounded-full">
          Upload foto
        </Button>
      </div>
    )
  }

  // Empty state — search no results
  if (images.length === 0 && search) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <ImageOff className="size-16 text-neutral-300" strokeWidth={1} />
        <div>
          <h3 className="text-heading font-heading text-lg font-bold">Tidak ada hasil</h3>
          <p className="text-caption mt-1 max-w-sm text-neutral-500">
            Tidak ada foto yang cocok dengan &ldquo;{search}&rdquo;
          </p>
        </div>
        <Button onClick={onClearSearch} variant="outline" className="rounded-full">
          Hapus pencarian
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(image)}
            mode={mode}
            onPick={() => onPick?.(image)}
            isSelected={selectedId === image.id}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <Button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
            className="rounded-full"
          >
            {isFetchingNextPage ? "Memuat..." : "Muat lainnya"}
          </Button>
        </div>
      )}
    </div>
  )
}
