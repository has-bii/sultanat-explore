import { z } from "zod"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export const uploadImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => ACCEPTED_TYPES.includes(f.type), "Unsupported file type")
    .refine((f) => f.size <= MAX_SIZE, "File too large"),
  alt: z.string().optional(),
})

export const updateImageSchema = z.object({
  alt: z.string().optional(),
})

export type UploadImageInput = z.infer<typeof uploadImageSchema>
export type UpdateImageInput = z.infer<typeof updateImageSchema>
