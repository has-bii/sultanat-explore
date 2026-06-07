import { z } from "zod"

export const createAttractionCategorySchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(50, "Nama maksimal 50 karakter"),
})

export const updateAttractionCategorySchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(50, "Nama maksimal 50 karakter").optional(),
})

export type CreateAttractionCategoryInput = z.infer<typeof createAttractionCategorySchema>
export type UpdateAttractionCategoryInput = z.infer<typeof updateAttractionCategorySchema>
