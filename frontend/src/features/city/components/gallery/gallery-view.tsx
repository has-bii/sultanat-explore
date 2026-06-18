import { ImageOff } from "lucide-react"
import { useRef } from "react"

import { Image as TImage } from "backend/generated/prisma/client"

import { DraggableItem } from "./draggable-item"

type GalleryImage = Pick<TImage, "id" | "url">

const COLS = 4

interface GalleryViewProps {
  images: GalleryImage[]
  onImageChange: (images: GalleryImage[]) => void
}

export function GalleryView({ images, onImageChange }: GalleryViewProps) {
  const constraintsRef = useRef<HTMLDivElement>(null)

  const handleRemove = (imageId: string) => {
    onImageChange(images.filter((img) => img.id !== imageId))
  }

  const handleSwap = (fromIndex: number, toIndex: number) => {
    const next = [...images]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    onImageChange(next)
  }

  if (images.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8">
        <ImageOff className="text-muted-foreground/50 size-8" strokeWidth={1.5} />
        <span className="text-caption text-muted-foreground">Belum ada foto di galeri</span>
      </div>
    )
  }

  return (
    <div ref={constraintsRef} className="grid grid-cols-4 gap-2">
      {images.map((image, index) => (
        <DraggableItem
          key={image.id}
          image={image}
          index={index}
          constraintsRef={constraintsRef}
          onSwap={handleSwap}
          onDelete={handleRemove}
          cols={COLS}
        />
      ))}
    </div>
  )
}
