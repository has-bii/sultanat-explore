"use client"

import dynamic from "next/dynamic"

import { useImageFilters } from "../hooks/use-image-filters"
import { useImageDetailSheetStore } from "../stores/image-detail-sheet.store"
import { useImageSelectionStore } from "../stores/image-selection.store"
import { ImageGridSkeleton } from "./image-grid-skeleton"
import { SelectionBar } from "./selection-bar"

const ImageGrid = dynamic(() => import("./image-grid"), {
  ssr: false,
  loading: () => <ImageGridSkeleton count={10} />,
})

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
      <ImageGrid
        query={apiQuery}
        onClearSearch={() => methods.onSearchChange("")}
        onImageClick={(image) => handleImageClick(image.id)}
        selectedIds={selectedIds}
        onImageCheckedChange={(image) => toggle(image.id)}
        className={className}
      />
    </>
  )
}
