"use client"

import dynamic from "next/dynamic"

import { FiltersToolbar } from "../components/filters-toolbar"
import { ImageSheet } from "../components/image-detail-sheet"
import { ImageGridSkeleton } from "../components/image-grid-skeleton"
import { UploadImagesDialog } from "../components/upload-images-dialog"

const ImageGridWithFilters = dynamic(
  () =>
    import("@/features/image/components/image-grid-with-filters").then((m) => ({
      default: m.ImageGridWithFilters,
    })),
  { ssr: false, loading: () => <ImageGridSkeleton count={10} /> },
)

export function ImagesPage() {
  return (
    <>
      <FiltersToolbar />
      <ImageGridWithFilters />
      <UploadImagesDialog />
      <ImageSheet />
    </>
  )
}
