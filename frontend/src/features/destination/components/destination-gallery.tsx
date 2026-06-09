"use client"

import { ArrowDown, ArrowUp, ImageOff, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldLabel } from "@/components/ui/field"
import { blurhashToDataUrl } from "@/features/image/lib/blurhash"
import Image from "next/image"

import { useAddGalleryImage } from "../mutations/add-gallery-image.mutation"
import { useRemoveGalleryImage } from "../mutations/remove-gallery-image.mutation"
import { useReorderGallery } from "../mutations/reorder-gallery.mutation"
import { useImagePickerDialogStore } from "../stores/image-picker-dialog.store"

interface GalleryImage {
  id: string
  url: string
  blurHash: string
}

interface DestinationGalleryProps {
  destinationId: string
  images: GalleryImage[]
}

export function DestinationGallery({ destinationId, images }: DestinationGalleryProps) {
  const onPickerOpen = useImagePickerDialogStore((s) => s.onOpen)
  const addMutation = useAddGalleryImage(destinationId)
  const removeMutation = useRemoveGalleryImage(destinationId)
  const reorderMutation = useReorderGallery(destinationId)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newIds = images.map((img) => img.id)
    ;[newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]]
    reorderMutation.mutate({ imageIds: newIds })
  }

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return
    const newIds = images.map((img) => img.id)
    ;[newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]]
    reorderMutation.mutate({ imageIds: newIds })
  }

  const handleRemove = (imageId: string) => {
    removeMutation.mutate(imageId)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <FieldLabel>Galeri</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onPickerOpen()}
            disabled={addMutation.isPending}
          >
            <Plus className="size-3.5" />
            Tambah Foto
          </Button>
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8">
            <ImageOff className="text-muted-foreground/50 size-8" strokeWidth={1.5} />
            <span className="text-caption text-muted-foreground">Belum ada foto di galeri</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div key={image.id} className="group relative flex flex-col gap-1.5">
                <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt={`Galeri ${index + 1}`}
                    fill
                    sizes="200px"
                    placeholder="blur"
                    blurDataURL={blurhashToDataUrl(image.blurHash)}
                    className="object-cover"
                  />
                  <span className="bg-muted/80 text-muted-foreground absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0 || reorderMutation.isPending}
                  >
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === images.length - 1 || reorderMutation.isPending}
                  >
                    <ArrowDown className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive rounded-full"
                    onClick={() => handleRemove(image.id)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
