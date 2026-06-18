"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { formatFileSize } from "@/utils/format-file-size"
import { intlFormatDistance } from "date-fns"
import Image from "next/image"

import { blurhashToDataUrl } from "../lib/blurhash"
import { PLACEHOLDER_BLURHASH } from "../lib/placeholder-blurhash"
import type { Image as TImage } from "../types"

interface ImageCardProps {
  image: TImage
  onClick?: (image: TImage) => void
  isSelected?: boolean
  isChecked?: boolean
  onCheckedChange?: (value: boolean) => void
}

export function ImageCard(props: ImageCardProps) {
  const { image, onClick, isSelected, isChecked, onCheckedChange } = props

  return (
    <Card
      role="button"
      className={cn(
        "group hover:ring-primary relative gap-4 pt-0 pb-4 transition-shadow",
        isSelected && "ring-primary",
      )}
      onClick={() => onClick?.(image)}
    >
      <figure className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={image.url}
          alt={image.alt ?? ""}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          placeholder="blur"
          blurDataURL={blurhashToDataUrl(PLACEHOLDER_BLURHASH)}
          className="object-cover"
        />
      </figure>
      {onCheckedChange && (
        <div
          className={cn(
            "absolute top-2 left-2 z-20 transition-opacity",
            isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isChecked}
            onCheckedChange={onCheckedChange}
            className="data-checked:bg-primary data-checked:border-primary size-5 rounded-full border-white bg-black/40"
          />
        </div>
      )}
      <CardHeader className="px-4">
        <CardTitle className="line-clamp-1">{image.alt || "Tanpa deskripsi"}</CardTitle>
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{formatFileSize(image.fileSize)}</CardDescription>
          <span className="text-muted-foreground block text-xs">
            {intlFormatDistance(image.createdAt, new Date(), { locale: "id" })}
          </span>
        </div>
      </CardHeader>
    </Card>
  )
}
