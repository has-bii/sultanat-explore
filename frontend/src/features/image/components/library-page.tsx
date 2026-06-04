"use client"

import { useState } from "react"

import { useImageList } from "../hooks/use-image-list"
import { useImageFilters } from "../lib/url-state"
import { ImageGrid } from "./image-grid"
import { ImageSheet } from "./image-sheet"
import { LibraryToolbar } from "./library-toolbar"
import { UploadModal } from "./upload-modal"

export function LibraryPage() {
  const { search, setSearch, sort, order, setOrder, setCursor, selected, setSelected } =
    useImageFilters()

  const [uploadOpen, setUploadOpen] = useState(false)

  const query = {
    sort: sort as "createdAt",
    order: order as "asc" | "desc",
    ...(search ? { search } : {}),
    limit: 20,
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
    useImageList(query)

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
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <div>
          <h3 className="text-heading font-heading text-lg font-bold">Gagal memuat foto</h3>
          <p className="text-caption mt-1 max-w-sm text-neutral-500">{error.message}</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <LibraryToolbar
        search={search}
        order={order}
        onSearchChange={setSearch}
        onOrderChange={setOrder}
        onUpload={() => setUploadOpen(true)}
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
        onUpload={() => setUploadOpen(true)}
      />

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />

      <ImageSheet imageId={selected} onOpenChange={(open) => !open && setSelected("")} />
    </div>
  )
}
