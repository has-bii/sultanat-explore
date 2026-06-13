"use client"

import { lazy } from "react"

import { ImageGridWithFilters } from "@/features/image/components/image-grid-with-filters"

import { ImageToolbar } from "../components/filters-toolbar"

const UploadImagesDialog = lazy(() =>
  import("@/features/image/components/upload-images-dialog").then((m) => ({
    default: m.UploadImagesDialog,
  })),
)
const ImageSheet = lazy(() =>
  import("@/features/image/components/image-detail-sheet").then((m) => ({ default: m.ImageSheet })),
)

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
