import * as v from "valibot"

import { cursorPaginationSchema, orderDirectionSchema } from "backend/schemas/query.schema"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB — enforced at confirm via R2 HeadObject

export const imageQuerySchema = v.object({
  ...cursorPaginationSchema.entries,
  order: orderDirectionSchema,
  sort: v.optional(v.picklist(["createdAt", "fileSize"]), "createdAt"),
  search: v.optional(v.pipe(v.string(), v.trim())),
})

export const presignImageSchema = v.object({
  files: v.pipe(
    v.array(
      v.object({
        contentType: v.picklist(ACCEPTED_TYPES),
        fileSize: v.pipe(v.number(), v.integer(), v.maxValue(MAX_IMAGE_SIZE)),
      }),
    ),
    v.minLength(1, "At least one file is required"),
    v.maxLength(3, "Maximum 3 files allowed"),
  ),
})

export const confirmImageSchema = v.object({
  items: v.pipe(
    v.array(
      v.object({
        key: v.pipe(v.string(), v.startsWith("images/")),
        fileSize: v.pipe(v.number(), v.integer(), v.maxValue(MAX_IMAGE_SIZE)),
        alt: v.optional(v.pipe(v.string(), v.trim())),
      }),
    ),
    v.minLength(1, "At least one item is required"),
    v.maxLength(3, "Maximum 3 items allowed"),
  ),
})

export const updateImageSchema = v.object({
  alt: v.optional(v.pipe(v.string(), v.trim())),
})

export const bulkDeleteImageSchema = v.object({
  ids: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("Invalid id"))),
    v.minLength(1, "At least one id is required"),
    v.maxLength(100, "Maximum 100 ids allowed"),
  ),
})

export type ImageQueryInput = v.InferInput<typeof imageQuerySchema>
export type ImageQueryOutput = v.InferOutput<typeof imageQuerySchema>
export type PresignImageInput = v.InferInput<typeof presignImageSchema>
export type PresignImageOutput = v.InferOutput<typeof presignImageSchema>
export type ConfirmImageInput = v.InferInput<typeof confirmImageSchema>
export type ConfirmImageOutput = v.InferOutput<typeof confirmImageSchema>
export type UpdateImageInput = v.InferInput<typeof updateImageSchema>
export type UpdateImageOutput = v.InferOutput<typeof updateImageSchema>
export type BulkDeleteImageInput = v.InferInput<typeof bulkDeleteImageSchema>
export type BulkDeleteImageOutput = v.InferOutput<typeof bulkDeleteImageSchema>
