"use client"

import { DateToString } from "@/utils/date-to-string.type"

import type { Image as TImage } from "backend/generated/prisma/client"

import { useImageFilters } from "../hooks/use-image-filters"
import { useImageDetailSheetStore } from "../stores/image-detail-sheet.store"
import { useImageSelectionStore } from "../stores/image-selection.store"
import { ImageGrid } from "./image-grid"
import { SelectionBar } from "./selection-bar"

type Image = DateToString<TImage>

interface Props {
  // Style
  className?: string
}

export function ImageGridWithFilters(props: Props) {
  const { className } = props

  const { query, methods } = useImageFilters()

  // Image Detail Sheet
  const onOpen = useImageDetailSheetStore((s) => s.onOpen)

  // Selection
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const toggle = useImageSelectionStore((s) => s.toggle)

  // Build query for API
  const apiQuery = {
    limit: "10",
    featured: query.featured || undefined,
    order: query.order,
    search: query.search || undefined,
    sort: query.sort || undefined,
  }

  const handleImageClick = (image: Image) => {
    onOpen(image.id)
  }

  return (
    <>
      <SelectionBar />
      <ImageGrid
        query={apiQuery}
        onClearSearch={() => methods.onSearchChange("")}
        onImageClick={handleImageClick}
        selectedIds={selectedIds}
        onImageCheckedChange={(image) => toggle(image.id)}
        className={className}
      />
    </>
  )
}
