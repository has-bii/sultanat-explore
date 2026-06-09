import * as v from "valibot"

export const createAttractionSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Nama harus diisi"), v.maxLength(100, "Nama maksimal 100 karakter")),
  description: v.pipe(
    v.string(),
    v.minLength(1, "Deskripsi harus diisi"),
    v.maxLength(5000, "Deskripsi maksimal 5000 karakter"),
  ),
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  categoryId: v.optional(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))),
})

export const updateAttractionSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.minLength(1, "Nama harus diisi"), v.maxLength(100, "Nama maksimal 100 karakter"))),
  description: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1, "Deskripsi harus diisi"),
      v.maxLength(5000, "Deskripsi maksimal 5000 karakter"),
    ),
  ),
  imageId: v.optional(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
  categoryId: v.optional(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))),
})

export const attractionQuerySchema = v.object({
  cursor: v.fallback(v.optional(v.pipe(v.string(), v.uuid("Invalid cursor"))), undefined),
  limit: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(10), v.maxValue(100)), 10),
  search: v.fallback(v.optional(v.string()), undefined),
  categoryId: v.fallback(v.optional(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))), undefined),
  sort: v.optional(v.picklist(["name", "createdAt"]), "createdAt"),
  order: v.optional(v.picklist(["asc", "desc"]), "desc"),
})

export const addAttractionGalleryImageSchema = v.object({
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  order: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
})

export const reorderAttractionGallerySchema = v.object({
  imageIds: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
    v.minLength(1, "Minimal 1 gambar"),
  ),
})

export type CreateAttractionInput = v.InferInput<typeof createAttractionSchema>
export type UpdateAttractionInput = v.InferInput<typeof updateAttractionSchema>
export type AttractionQueryInput = v.InferOutput<typeof attractionQuerySchema>
export type AddAttractionGalleryImageInput = v.InferInput<typeof addAttractionGalleryImageSchema>
export type ReorderAttractionGalleryInput = v.InferInput<typeof reorderAttractionGallerySchema>
