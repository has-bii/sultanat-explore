"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImageCard({ image, onClick, mode = "view", onPick, isSelected }: ImageCardProps) {
  return (
    <Card
      role="button"
      className={cn(
        "hover:ring-primary gap-4 pt-0 pb-4 transition-shadow",
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
