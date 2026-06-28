import * as v from "valibot"

export const galleryTypeSchema = v.picklist(["home", "open_trip", "private_trip", "umrah"])

export const galleryQuerySchema = v.object({
  type: galleryTypeSchema,
})

export const syncGallerySchema = v.object({
  imageIds: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
    v.maxLength(20, "Maksimal 20 gambar"),
  ),
})

export type GalleryType = v.InferOutput<typeof galleryTypeSchema>
export type GalleryQueryOutput = v.InferOutput<typeof galleryQuerySchema>
export type SyncGalleryInput = v.InferInput<typeof syncGallerySchema>
