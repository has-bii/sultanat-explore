import * as v from "valibot"

import { cursorPaginationSchema, orderDirectionSchema } from "backend/schemas/query.schema"

export const createCitySchema = v.object({
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
  categoryIds: v.optional(
    v.pipe(
      v.array(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))),
      v.maxLength(10, "Maksimal 10 kategori"),
    ),
  ),
})

export const updateCitySchema = v.partial(createCitySchema)

export const cityQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  search: v.optional(v.string()),
  featured: v.optional(
    v.pipe(
      v.picklist(["true", "false"]),
      v.transform((val) => val === "true"),
    ),
  ),
  sort: v.optional(v.picklist(["name", "createdAt"]), "createdAt"),
  order: orderDirectionSchema,
})

export const syncGallerySchema = v.object({
  imageIds: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
    v.maxLength(20, "Maksimal 20 gambar"),
  ),
})

export type CreateCityInput = v.InferInput<typeof createCitySchema>
export type CreateCityOutput = v.InferOutput<typeof createCitySchema>
export type UpdateCityInput = v.InferInput<typeof updateCitySchema>
export type CityQueryInput = v.InferInput<typeof cityQuerySchema>
export type CityQueryOutput = v.InferOutput<typeof cityQuerySchema>
export type SyncGalleryInput = v.InferInput<typeof syncGallerySchema>
