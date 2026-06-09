import * as v from "valibot"

export const createDestinationSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
  tagline: v.pipe(
    v.string(),
    v.minLength(1, "Tagline harus diisi"),
    v.maxLength(200, "Tagline maksimal 200 karakter"),
  ),
  description: v.pipe(
    v.string(),
    v.minLength(1, "Deskripsi harus diisi"),
    v.maxLength(5000, "Deskripsi maksimal 5000 karakter"),
  ),
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  featured: v.boolean(),
  highlights: v.pipe(
    v.array(
      v.pipe(
        v.string(),
        v.minLength(1, "Highlight tidak boleh kosong"),
        v.maxLength(200, "Highlight maksimal 200 karakter"),
      ),
    ),
    v.minLength(1, "Minimal 1 highlights"),
    v.maxLength(20, "Maksimal 20 highlights"),
  ),
})

export const updateDestinationSchema = v.partial(createDestinationSchema)

export const destinationQuerySchema = v.object({
  cursor: v.fallback(v.optional(v.pipe(v.string(), v.uuid("Invalid cursor"))), undefined),
  limit: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(10), v.maxValue(100)), 10),
  search: v.fallback(v.optional(v.string()), undefined),
  featured: v.fallback(
    v.optional(
      v.pipe(
        v.picklist(["true", "false"]),
        v.transform((val) => val === "true"),
      ),
    ),
    undefined,
  ),
  sort: v.optional(v.picklist(["name", "createdAt"]), "createdAt"),
  order: v.optional(v.picklist(["asc", "desc"]), "desc"),
})

export const addGalleryImageSchema = v.object({
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  order: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
})

export const reorderGallerySchema = v.object({
  imageIds: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
    v.minLength(1, "Minimal 1 gambar"),
  ),
})

export type CreateDestinationInput = v.InferInput<typeof createDestinationSchema>
export type CreateDestinationOutput = v.InferOutput<typeof createDestinationSchema>
export type UpdateDestinationInput = v.InferInput<typeof updateDestinationSchema>
export type DestinationQueryInput = v.InferOutput<typeof destinationQuerySchema>
export type AddGalleryImageInput = v.InferInput<typeof addGalleryImageSchema>
export type ReorderGalleryInput = v.InferInput<typeof reorderGallerySchema>
