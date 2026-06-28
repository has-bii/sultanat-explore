import { queryOptions } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferResponseType } from "hono"

import type { GalleryType } from "backend/modules/gallery/gallery.schema"

const $getGallery = apiClient.api.gallery.$get

export type GetGalleryResponse = InferResponseType<typeof $getGallery, 200>

export const galleryQueryKeys = {
  all: () => ["gallery"] as const,
  byType: (type: GalleryType) => [...galleryQueryKeys.all(), type] as const,
}

export const getGalleryQueryOptions = (type: GalleryType) => {
  return queryOptions({
    queryKey: galleryQueryKeys.byType(type),
    queryFn: async () => {
      const res = await $getGallery({ query: { type } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
