import * as v from "valibot"

import { cursorPaginationSchema, orderDirectionSchema } from "backend/schemas/query.schema"

export const createAttractionSchema = v.object({
  destinationId: v.pipe(v.string(), v.uuid("ID destinasi tidak valid")),
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
  description: v.pipe(
    v.string(),
    v.minLength(1, "Deskripsi harus diisi"),
    v.maxLength(5000, "Deskripsi maksimal 5000 karakter"),
  ),
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
})

export const updateAttractionSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1, "Nama harus diisi"),
      v.maxLength(100, "Nama maksimal 100 karakter"),
    ),
  ),
  description: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1, "Deskripsi harus diisi"),
      v.maxLength(5000, "Deskripsi maksimal 5000 karakter"),
    ),
  ),
  imageId: v.optional(v.pipe(v.string(), v.uuid("ID gambar tidak valid"))),
})

export const attractionQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  search: v.fallback(v.optional(v.string()), undefined),
  sort: v.optional(v.picklist(["name", "createdAt"]), "createdAt"),
  order: orderDirectionSchema,
  destinationId: v.optional(v.pipe(v.string(), v.uuid("ID destinasi tidak valid"))),
})

export const attractionIdParamSchema = v.object({
  id: v.pipe(v.string(), v.uuid("Invalid id")),
})

export type CreateAttractionInput = v.InferInput<typeof createAttractionSchema>
export type UpdateAttractionInput = v.InferInput<typeof updateAttractionSchema>
export type AttractionQueryInput = v.InferInput<typeof attractionQuerySchema>
export type AttractionQueryOutput = v.InferOutput<typeof attractionQuerySchema>
