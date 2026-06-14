import * as v from "valibot"

import { cursorPaginationSchema, orderDirectionSchema } from "backend/schemas/query.schema"

export const createArticleSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, "Judul harus diisi"),
    v.maxLength(200, "Judul maksimal 200 karakter"),
  ),
  excerpt: v.pipe(
    v.string(),
    v.minLength(1, "Ringkasan harus diisi"),
    v.maxLength(500, "Ringkasan maksimal 500 karakter"),
  ),
  content: v.any(), // opaque JSON — frontend owns block shapes
  imageId: v.pipe(v.string(), v.uuid("ID gambar tidak valid")),
  categoryId: v.optional(v.pipe(v.string(), v.uuid("ID kategori tidak valid"))),
  published: v.boolean(),
})

export const updateArticleSchema = v.partial(createArticleSchema)

export const articleQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  search: v.optional(v.string()),
  category: v.optional(v.string()), // category slug
  published: v.optional(v.pipe(v.picklist(["true", "false"]), v.toBoolean())),
  sort: v.optional(v.picklist(["createdAt", "publishedAt"]), "createdAt"),
  order: orderDirectionSchema,
})

export const articleRelatedQuerySchema = v.object({
  limit: v.optional(v.pipe(v.string(), v.toNumber(), v.minValue(1), v.maxValue(20)), "3"),
})

export type CreateArticleInput = v.InferInput<typeof createArticleSchema>
export type CreateArticleOutput = v.InferOutput<typeof createArticleSchema>
export type UpdateArticleInput = v.InferInput<typeof updateArticleSchema>
export type ArticleQueryInput = v.InferInput<typeof articleQuerySchema>
export type ArticleQueryOutput = v.InferOutput<typeof articleQuerySchema>
export type ArticleRelatedQueryInput = v.InferInput<typeof articleRelatedQuerySchema>
