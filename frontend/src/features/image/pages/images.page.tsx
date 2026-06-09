"use client"

import dynamic from "next/dynamic"

import { FiltersToolbar } from "../components/filters-toolbar"
import { ImageSheet } from "../components/image-detail-sheet"
import { ImageGridSkeleton } from "../components/image-grid-skeleton"
import { SelectionBar } from "../components/selection-bar"
import { UploadImagesDialog } from "../components/upload-images-dialog"
import { useImageFilters } from "../hooks/use-image-filters"
import { useImageDetailSheetStore } from "../stores/image-detail-sheet.store"
import { useImageSelectionStore } from "../stores/image-selection.store"

const ImageGrid = dynamic(
  () => import("@/features/image/components/image-grid").then((m) => ({ default: m.ImageGrid })),
  { ssr: false, loading: () => <ImageGridSkeleton count={10} /> },
)

export function ImagesPage() {
  // Get SearchURL Query
  const { search, setSearch, order, setOrder } = useImageFilters()
  //   Restructure query
  const query = {
    order,
    sort: "createdAt" as const,
    limit: "10",
    ...(search ? { search } : {}),
  }

  // Image Detail Sheet
  const onOpen = useImageDetailSheetStore((s) => s.onOpen)

  // Selection
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const toggle = useImageSelectionStore((s) => s.toggle)

  const handleImageClick = (image: { id: string }) => {
    onOpen(image.id)
  }

  return (
    <>
      <FiltersToolbar
        search={search}
        onSearchChange={setSearch}
        order={order}
        onOrderChange={setOrder}
      />

      <SelectionBar />

      <ImageGrid
        query={query}
        onClearSearch={() => setSearch("")}
        onImageClick={handleImageClick}
        selectedIds={selectedIds}
        onImageCheckedChange={(image) => toggle(image.id)}
      />

      <UploadImagesDialog />

      <ImageSheet />
    </>
  )
}
