"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { FiltersToolbar } from "../components/filters-toolbar"
import { ImageErrorMessage } from "../components/image-error-message"
import { ImageGrid } from "../components/image-grid"
import { ImageSheet } from "../components/image-sheet"
import { UploadImagesDialog } from "../components/upload-images-dialog"
import { useImageFilters } from "../hooks/use-image-filters"
import { getImagesQueryOptions } from "../query/get-images.query"

export function ImagesPage() {
  // Get SearchURL Query
  const { search, setSearch, order, setOrder, sort, setCursor, selected, setSelected } =
    useImageFilters()

  //   Restructure query
  const query = {
    sort: sort as "createdAt",
    order: order as "asc" | "desc",
    ...(search ? { search } : {}),
    limit: 20,
  }

  //   Fetching data
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
    useInfiniteQuery(getImagesQueryOptions(query))

  const images = data?.pages.flatMap((p) => p.data) ?? []

  const handleLoadMore = () => {
    const lastPage = data?.pages[data.pages.length - 1]
    if (lastPage?.nextCursor) {
      setCursor(lastPage.nextCursor)
    }
    fetchNextPage()
  }

  const handleImageClick = (image: { id: string }) => {
    setSelected(image.id)
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

      <ImageGrid
        images={images}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        search={search}
        onLoadMore={handleLoadMore}
        onImageClick={handleImageClick}
        onClearSearch={() => setSearch("")}
      />

      <UploadImagesDialog />

      <ImageSheet imageId={selected} onOpenChange={(open) => !open && setSelected("")} />
    </>
  )
}
