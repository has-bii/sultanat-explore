"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

import { useImageDetail } from "../hooks/use-image-detail"
import { useImageList } from "../hooks/use-image-list"
import { blurhashToDataUrl } from "../lib/blurhash"
import { ImageGrid } from "./image-grid"

interface ImagePickerSingleProps {
  value: string | null
  onChange: (imageId: string | null) => void
  label?: string
  disabled?: boolean
}

export function ImagePickerSingle({
  value,
  onChange,
  label = "Foto",
  disabled = false,
}: ImagePickerSingleProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [order] = useState("desc")

  const { data: selectedImage } = useImageDetail(value)

  const query = {
    sort: "createdAt" as const,
    order: order as "asc" | "desc",
    ...(search ? { search } : {}),
    limit: 20,
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useImageList(query)

  const images = data?.pages.flatMap((p) => p.data) ?? []

  const handlePick = (image: { id: string }) => {
    onChange(image.id)
    setOpen(false)
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-caption font-medium text-neutral-600">{label}</label>}

      {value && selectedImage ? (
        <div className="flex items-center gap-3 rounded-lg border p-2">
          <div className="relative size-12 shrink-0 overflow-hidden rounded bg-neutral-100">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt ?? ""}
              fill
              sizes="48px"
              placeholder="blur"
              blurDataURL={blurhashToDataUrl(selectedImage.blurHash)}
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-small-heading truncate text-sm">
              {selectedImage.alt || "Tanpa judul"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={disabled}
            className="shrink-0 rounded-full"
          >
            <Pencil className="mr-1 size-3" />
            Ganti
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="shrink-0 rounded-full"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className="w-full rounded-full"
        >
          Pilih foto
        </Button>
      )}

      {!value && <p className="text-caption text-neutral-400">Belum ada foto dipilih</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-heading font-heading font-bold">Pilih Foto</DialogTitle>
          </DialogHeader>
          <ImageGrid
            images={images}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            search={search}
            onLoadMore={() => fetchNextPage()}
            onImageClick={() => {}}
            onClearSearch={() => setSearch("")}
            onUpload={() => {}}
            mode="pick"
            onPick={handlePick}
            selectedId={value}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
