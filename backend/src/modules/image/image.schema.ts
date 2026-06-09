import * as v from "valibot"

import { querySchema } from "backend/schemas/query.schema"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export const imageQuerySchema = v.object({
  ...querySchema.entries,
  order: v.optional(v.picklist(["asc", "desc"]), "desc"),
  sort: v.optional(v.picklist(["createdAt"]), "createdAt"),
  search: v.optional(v.pipe(v.string(), v.trim())),
})

const imageFileSchema = v.pipe(
  v.instance(File),
  v.check(
    (f) => ACCEPTED_TYPES.includes(f.type as (typeof ACCEPTED_TYPES)[number]),
    "Unsupported file type",
  ),
  v.check((f) => f.size <= MAX_SIZE, "File too large"),
)

export const uploadImageSchema = v.object({
  files: v.union([
    imageFileSchema,
    v.pipe(
      v.array(imageFileSchema),
      v.minLength(1, "At least one file is required"),
      v.maxLength(10, "Maximum 10 files allowed"),
    ),
  ]),
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
export type UploadImageInput = v.InferInput<typeof uploadImageSchema>
export type UploadImageOutput = v.InferOutput<typeof uploadImageSchema>
export type UpdateImageInput = v.InferInput<typeof updateImageSchema>
export type UpdateImageOutput = v.InferOutput<typeof updateImageSchema>
export type BulkDeleteImageInput = v.InferInput<typeof bulkDeleteImageSchema>
export type BulkDeleteImageOutput = v.InferOutput<typeof bulkDeleteImageSchema>
