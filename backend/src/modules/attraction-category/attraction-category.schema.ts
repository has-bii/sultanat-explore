import * as v from "valibot"

export const createAttractionCategorySchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Nama harus diisi"), v.maxLength(50, "Nama maksimal 50 karakter")),
})

export const updateAttractionCategorySchema = v.object({
  name: v.optional(v.pipe(v.string(), v.minLength(1, "Nama harus diisi"), v.maxLength(50, "Nama maksimal 50 karakter"))),
})

export type CreateAttractionCategoryInput = v.InferInput<typeof createAttractionCategorySchema>
export type UpdateAttractionCategoryInput = v.InferInput<typeof updateAttractionCategorySchema>
