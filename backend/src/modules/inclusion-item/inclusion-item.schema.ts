import * as v from "valibot"

import { cursorPaginationSchema } from "backend/schemas/query.schema"

export const createInclusionItemSchema = v.object({
  label: v.pipe(v.string(), v.minLength(1, "Label harus diisi"), v.maxLength(200, "Label maksimal 200 karakter")),
})

export const updateInclusionItemSchema = v.object({
  label: v.optional(v.pipe(v.string(), v.minLength(1, "Label harus diisi"), v.maxLength(200, "Label maksimal 200 karakter"))),
})

export const inclusionItemQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  search: v.optional(v.string()),
})

export type CreateInclusionItemInput = v.InferInput<typeof createInclusionItemSchema>
export type UpdateInclusionItemInput = v.InferInput<typeof updateInclusionItemSchema>
export type InclusionItemQueryInput = v.InferInput<typeof inclusionItemQuerySchema>
export type InclusionItemQueryOutput = v.InferOutput<typeof inclusionItemQuerySchema>
