"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { SaveIcon } from "lucide-react"
import { Suspense, useState } from "react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GalleryView } from "@/features/city/components/gallery/gallery-view"
import {
  MultiImagePickerDialog,
  type PickedImage,
} from "@/features/image/components/multi-picker-dialog"

import { Image as TImage } from "backend/generated/prisma/client"
import type { GalleryType } from "backend/modules/gallery/gallery.schema"

import { useSyncGallery } from "../mutations/sync-gallery.mutation"
import { getGalleryQueryOptions } from "../queries"
import { GalleryCardSkeleton } from "./gallery-card-skeleton"

type GalleryImage = Pick<TImage, "id" | "url">

const GALLERY_TYPES: { value: GalleryType; label: string }[] = [
  { value: "home", label: "Beranda" },
  { value: "open_trip", label: "Open Trip" },
  { value: "private_trip", label: "Private Trip" },
  { value: "umrah", label: "Umrah" },
]

function GalleryCard({ type }: { type: GalleryType }) {
  const { data } = useSuspenseQuery(getGalleryQueryOptions(type))
  const initialImages = data.map(({ image }) => image)
  const syncMutation = useSyncGallery(type)
  const [localImages, setLocalImages] = useState<GalleryImage[]>(initialImages)

  const handlePickerChange = (picked: PickedImage[]) => {
    setLocalImages(picked.map((img) => ({ id: img.id, url: img.url })))
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
        <CardTitle>Galeri</CardTitle>
        <CardDescription>Pilih dan atur foto di galeri. Maksimal 20 foto.</CardDescription>
        <CardAction>
          <MultiImagePickerDialog
            onChange={handlePickerChange}
            selectedImages={localImages}
            max={20}
          />
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

export function GalleryManager() {
  const [activeType, setActiveType] = useState<GalleryType>("home")

  return (
    <div className="space-y-6">
      <Tabs value={activeType} onValueChange={(v) => setActiveType(v as GalleryType)}>
        <TabsList className="px-1">
          {GALLERY_TYPES.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* key resets local state when switching tabs */}
      <Suspense fallback={<GalleryCardSkeleton />}>
        <GalleryCard key={activeType} type={activeType} />
      </Suspense>
    </div>
  )
}
