"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { SaveIcon } from "lucide-react"
import { useState } from "react"

import { ButtonLoading } from "@/components/button-loading"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MultiImagePickerDialog,
  type PickedImage,
} from "@/features/image/components/multi-image-picker-dialog"

import { Image as TImage } from "backend/generated/prisma/client"

import { useUpdateGallery } from "../../mutations/update-gallery.mutation"
import { getDestinationGalleryQueryOptions } from "../../queries"
import { GalleryView } from "./gallery-view"

export function DestinationGallerySkeleton() {
  return (
    <div className="flex w-full flex-col gap-0 rounded-2xl border">
      <div className="flex flex-col gap-1 border-b p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-4 gap-2 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  )
}

type GalleryImage = Pick<TImage, "id" | "url" | "blurHash">

interface Props {
  destinationId: string
}

export function DestinationGallery({ destinationId }: Props) {
  const { data } = useSuspenseQuery(getDestinationGalleryQueryOptions(destinationId))
  const initialImages = data.map(({ image }) => image)
  const syncMutation = useUpdateGallery(destinationId)
  const [localImages, setLocalImages] = useState<GalleryImage[]>(initialImages)

  const handlePickerChange = (picked: PickedImage[]) => {
    setLocalImages(picked.map((img) => ({ id: img.id, url: img.url, blurHash: img.blurHash })))
  }

  const handleSave = () => {
    syncMutation.mutate({ imageIds: localImages.map((img) => img.id) })
  }

  const hasChanges =
    localImages.length !== initialImages.length ||
    localImages.some((img, i) => img.id !== initialImages[i]?.id)

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>Galeri Destinasi</CardTitle>
        <CardDescription>Pilih dan atur foto di galeri. Maksimal 10 foto.</CardDescription>
        <CardAction>
          <MultiImagePickerDialog onChange={handlePickerChange} selectedImages={localImages} />
        </CardAction>
      </CardHeader>
      <CardContent className="h-full">
        <GalleryView images={localImages} onImageChange={setLocalImages} />
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between border-t">
        <CardDescription>Drag & drop untuk mengurutkan foto</CardDescription>
        <ButtonLoading
          onClick={handleSave}
          isLoading={syncMutation.isPending}
          disabled={!hasChanges}
          loadingLabel="Menyimpan..."
          icon={SaveIcon}
        >
          Simpan
        </ButtonLoading>
      </CardFooter>
    </Card>
  )
}
