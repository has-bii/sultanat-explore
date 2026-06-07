import { z } from "zod"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const imageFileSchema = z
  .instanceof(File)
  .refine((f) => ACCEPTED_TYPES.includes(f.type), "Unsupported file type")
  .refine((f) => f.size <= MAX_SIZE, "File too large")

export const uploadImageSchema = z.object({
  files: z.union([
    imageFileSchema,
    z
      .array(imageFileSchema)
      .min(1, "At least one file is required")
      .max(10, "Maximum 10 files allowed"),
  ]),
})

export const updateImageSchema = z.object({
  alt: z.string().optional(),
})

export const bulkDeleteImageSchema = z.object({
  ids: z
    .array(z.string().uuidv7("Invalid id"))
    .min(1, "At least one id is required")
    .max(100, "Maximum 100 ids allowed"),
})

export type UploadImageInput = z.infer<typeof uploadImageSchema>
export type UpdateImageInput = z.infer<typeof updateImageSchema>
export type BulkDeleteImageInput = z.infer<typeof bulkDeleteImageSchema>
