"use client"

import { Suspense } from "react"

import { useImageFilters } from "../../hooks/use-image-filters"
import { useImageDetailSheetStore } from "../../stores/image-detail-sheet.store"
import { useImageSelectionStore } from "../../stores/image-selection.store"
import { ImageGrid } from "./index"
import { ImageGridSkeleton } from "./skeleton"
import { SelectionBar } from "../selection-bar"

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

  const handleImageClick = (id: string) => {
    onOpen(id)
  }

  return (
    <>
      <SelectionBar />
      <Suspense fallback={<ImageGridSkeleton count={10} />}>
        <ImageGrid
          query={apiQuery}
          onClearSearch={() => methods.onSearchChange("")}
          onImageClick={(image) => handleImageClick(image.id)}
          selectedIds={selectedIds}
          onImageCheckedChange={(image) => toggle(image.id)}
          className={className}
        />
      </Suspense>
    </>
  )
}
