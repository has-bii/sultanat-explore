import * as v from "valibot"

import { cursorPaginationSchema, orderDirectionSchema } from "backend/schemas/query.schema"

export const createDestinationSchema = v.object({
  cityId: v.pipe(v.string(), v.uuid("ID kota tidak valid")),
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
  featured: v.optional(v.boolean(), false),
})

export const updateDestinationSchema = v.object({
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
  featured: v.optional(v.boolean()),
})

export const destinationQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  search: v.fallback(v.optional(v.string()), undefined),
  sort: v.optional(v.picklist(["name", "createdAt"]), "createdAt"),
  order: orderDirectionSchema,
  cityId: v.optional(v.pipe(v.string(), v.uuid("ID kota tidak valid"))),
  featured: v.optional(
    v.pipe(
      v.picklist(["true", "false"]),
      v.transform((val) => val === "true"),
    ),
  ),
})

export const destinationIdParamSchema = v.object({
  id: v.pipe(v.string(), v.uuid("Invalid id")),
})

export type CreateDestinationInput = v.InferInput<typeof createDestinationSchema>
export type UpdateDestinationInput = v.InferInput<typeof updateDestinationSchema>
export type DestinationQueryInput = v.InferInput<typeof destinationQuerySchema>
export type DestinationQueryOutput = v.InferOutput<typeof destinationQuerySchema>
