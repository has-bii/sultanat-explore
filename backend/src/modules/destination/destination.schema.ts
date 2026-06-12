import * as v from "valibot"

import { paramIdSchema } from "backend/schemas/param.schema"
import { querySchema } from "backend/schemas/query.schema"

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
  ...querySchema.entries,
  search: v.optional(v.string()),
  featured: v.optional(
    v.pipe(
      v.picklist(["true", "false"]),
      v.transform((val) => val === "true"),
    ),
  ),
  sort: v.optional(v.picklist(["name", "createdAt"]), "createdAt"),
  order: v.optional(v.picklist(["asc", "desc"]), "desc"),
})

export const syncGallerySchema = v.object({
  imageIds: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
    v.maxLength(20, "Maksimal 20 gambar"),
  ),
})

export type CreateDestinationInput = v.InferInput<typeof createDestinationSchema>
export type CreateDestinationOutput = v.InferOutput<typeof createDestinationSchema>
export type UpdateDestinationInput = v.InferInput<typeof updateDestinationSchema>
export type DestinationQueryInput = v.InferInput<typeof destinationQuerySchema>
export type DestinationQueryOutput = v.InferOutput<typeof destinationQuerySchema>
export type SyncGalleryInput = v.InferInput<typeof syncGallerySchema>
