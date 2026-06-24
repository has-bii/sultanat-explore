import * as v from "valibot"

export const createCityCategorySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
})

export const updateCityCategorySchema = v.partial(createCityCategorySchema)

export type CreateCityCategoryInput = v.InferInput<typeof createCityCategorySchema>
export type CreateCityCategoryOutput = v.InferOutput<typeof createCityCategorySchema>
export type UpdateCityCategoryInput = v.InferInput<typeof updateCityCategorySchema>