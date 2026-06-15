import { ImageGridWithFilters } from "@/features/image/components/grid/with-filters"
import { ImageSheet } from "@/features/image/components/detail-sheet"
import { UploadImagesDialog } from "@/features/image/components/upload-dialog"

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
