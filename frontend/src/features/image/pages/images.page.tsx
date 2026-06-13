import { ImageGridWithFilters } from "@/features/image/components/image-grid-with-filters"
import { ImageSheet } from "@/features/image/components/image-detail-sheet"
import { UploadImagesDialog } from "@/features/image/components/upload-images-dialog"

import { ImageToolbar } from "../components/filters-toolbar"

export function ImagesPage() {
  return (
    <>
      <ImageToolbar />
      <ImageGridWithFilters />
      <UploadImagesDialog />
      <ImageSheet />
    </>
  )
}
