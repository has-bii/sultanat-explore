"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { FiltersToolbar } from "../components/filters-toolbar"
import { ImageSheet } from "../components/image-detail-sheet"
import { ImageErrorMessage } from "../components/image-error-message"
import { ImageGrid } from "../components/image-grid"
import { SelectionBar } from "../components/selection-bar"
import { UploadImagesDialog } from "../components/upload-images-dialog"
import { useImageFilters } from "../hooks/use-image-filters"
import { getImagesQueryOptions } from "../query/get-images.query"
import { useImageDetailSheetStore } from "../stores/image-detail-sheet.store"
import { useImageSelectionStore } from "../stores/image-selection.store"

export function ImagesPage() {
  // Get SearchURL Query
  const { search, setSearch, order, setOrder, sort } = useImageFilters()

  // Image Detail Sheet
  const onOpen = useImageDetailSheetStore((s) => s.onOpen)

  // Selection
  const selectedIds = useImageSelectionStore((s) => s.selectedIds)
  const toggle = useImageSelectionStore((s) => s.toggle)

  //   Restructure query
  const query = {
    sort: sort as "createdAt",
    order: order as "asc" | "desc",
    ...(search ? { search } : {}),
    limit: 10,
  }

  //   Fetching data
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
    useInfiniteQuery(getImagesQueryOptions(query))

  const images = data?.pages.flatMap((p) => p.data) ?? []

  const handleImageClick = (image: { id: string }) => {
    onOpen(image.id)
  }

  if (isError) {
    return <ImageErrorMessage error={error} />
  }

  return (
    <>
      <FiltersToolbar
        search={search}
        onSearchChange={setSearch}
        order={order}
        onOrderChange={setOrder}
      />

      <SelectionBar allImageIds={images.map((i) => i.id)} />

      <ImageGrid
        images={images}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        search={search}
        onLoadMore={fetchNextPage}
        onImageClick={handleImageClick}
        onClearSearch={() => setSearch("")}
        onToggleSelection={toggle}
        selectedIds={selectedIds}
      />

      <UploadImagesDialog />

      <ImageSheet />
    </>
  )
}
