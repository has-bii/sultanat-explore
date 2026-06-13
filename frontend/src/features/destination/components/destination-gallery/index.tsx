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
        >
          <SaveIcon />
          <span>Simpan</span>
        </ButtonLoading>
      </CardFooter>
    </Card>
  )
}
