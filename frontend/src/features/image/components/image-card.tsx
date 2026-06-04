"use client"

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

function formatRelativeDate(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)

  if (diffMin < 1) return "Baru saja"
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHour < 24) return `${diffHour} jam lalu`
  if (diffDay < 7) return `${diffDay} hari lalu`
  return `${diffWeek} minggu lalu`
}

export function ImageCard({ image, onClick, mode = "view", onPick, isSelected }: ImageCardProps) {
  return (
    <button
      type="button"
      onClick={mode === "pick" ? onPick : onClick}
      className={`group relative overflow-hidden rounded-lg border bg-white text-left transition-all hover:border-neutral-400 ${
        isSelected ? "border-neutral-900 ring-2 ring-neutral-900" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={image.url}
          alt={image.alt ?? ""}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          placeholder="blur"
          blurDataURL={blurhashToDataUrl(image.blurHash)}
          className="object-cover"
        />
        {mode === "pick" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              Pilih
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="text-small-heading line-clamp-2 leading-tight font-medium">
          {image.alt || "Tanpa judul"}
        </p>
        <div className="text-caption flex items-center justify-between text-neutral-500">
          <span>{formatFileSize(image.fileSize)}</span>
          <span>{formatRelativeDate(image.createdAt)}</span>
        </div>
      </div>
    </button>
  )
}
