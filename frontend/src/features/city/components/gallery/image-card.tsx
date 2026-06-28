import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { blurhashToDataUrl } from "@/features/image/lib/blurhash"
import { PLACEHOLDER_BLURHASH } from "@/features/image/lib/placeholder-blurhash"
import { cn } from "@/lib/utils"
import Image from "next/image"

import type { Image as TImage } from "backend/generated/prisma/client"

interface ImageCardProp {
  data: Pick<TImage, "id" | "url">
  onDelete: (id: string) => void
  isDragging?: boolean
}

export function ImageCard({ data, onDelete, isDragging }: ImageCardProp) {
  return (
    <div
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-xl transition-all",
        isDragging ? "scale-110 cursor-grabbing shadow-xl" : "cursor-grab",
      )}
    >
      <Image
        src={data.url}
        alt=""
        width={300}
        height={300}
        draggable={false}
        className="pointer-events-none size-full object-cover object-center"
        placeholder="blur"
        // ponytail: gallery local state is {id,url} (picker pipeline); 300px drag-thumb — placeholder is fine here
        blurDataURL={blurhashToDataUrl(PLACEHOLDER_BLURHASH)}
      />
      <div className="pointer-events-auto absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button size="icon" variant="destructive" onClick={() => onDelete(data.id)}>
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}
