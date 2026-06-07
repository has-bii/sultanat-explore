"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { intlFormatDistance } from "date-fns"
import Image from "next/image"

import type { Image as ImageType } from "../dto/image.schema"
import { blurhashToDataUrl } from "../lib/blurhash"

interface ImageCardProps {
  image: ImageType
  onClick: () => void
  mode?: "view" | "pick"
  onPick?: () => void
  isSelected?: boolean
  onCheckboxChange?: () => void
  checked?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImageCard({
  image,
  onClick,
  mode = "view",
  onPick,
  isSelected,
  onCheckboxChange,
  checked,
}: ImageCardProps) {
  return (
    <Card
      role="button"
      className={cn(
        "group hover:ring-primary relative gap-4 pt-0 pb-4 transition-shadow",
        isSelected && "ring-primary",
      )}
      onClick={mode === "pick" ? onPick : onClick}
    >
      <figure className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={image.url}
          alt={image.alt ?? ""}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          placeholder="blur"
          blurDataURL={blurhashToDataUrl(image.blurHash)}
          className="object-cover"
        />
      </figure>
      {onCheckboxChange && mode === "view" && (
        <div
          className={cn(
            "absolute top-2 left-2 z-20 transition-opacity",
            checked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckboxChange}
            className="data-checked:bg-primary data-checked:border-primary size-5 rounded-full border-white bg-black/40"
          />
        </div>
      )}
      <CardHeader className="px-4">
        {mode === "pick" && (
          <CardAction>
            <Badge variant="secondary">Pilih</Badge>
          </CardAction>
        )}
        <CardTitle className="line-clamp-1">{image.alt || "Tanpa deskripsi"}</CardTitle>
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{formatFileSize(image.fileSize)}</CardDescription>
          <CardDescription>
            {intlFormatDistance(image.createdAt, new Date(), { locale: "id" })}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
