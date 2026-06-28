import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import type { GalleryType } from "backend/modules/gallery/gallery.schema"

import { galleryQueryKeys } from "../queries"

const $syncGallery = apiClient.api.gallery.$put

export const SYNC_GALLERY_MUTATION_KEY = ["sync-gallery"] as const

export const useSyncGallery = (type: GalleryType) => {
  return useMutation({
    mutationKey: [...SYNC_GALLERY_MUTATION_KEY, type],
    mutationFn: async (input: InferRequestType<typeof $syncGallery>["json"]) => {
      const res = await $syncGallery({ query: { type }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _err, _var, _result, context) => {
      context.client.invalidateQueries({
        queryKey: galleryQueryKeys.byType(type),
        exact: true,
      })
    },
  })
}
