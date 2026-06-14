import * as v from "valibot"

export const createCategorySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
})

export const updateCategorySchema = v.partial(createCategorySchema)

export type CreateCategoryInput = v.InferInput<typeof createCategorySchema>
export type CreateCategoryOutput = v.InferOutput<typeof createCategorySchema>
export type UpdateCategoryInput = v.InferInput<typeof updateCategorySchema>
