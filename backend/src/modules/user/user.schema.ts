import * as v from "valibot"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export const uploadAvatarSchema = v.object({
  file: v.pipe(
    v.instance(File),
    v.check(
      (f) => ACCEPTED_TYPES.includes(f.type as (typeof ACCEPTED_TYPES)[number]),
      "Unsupported file type",
    ),
    v.check((f) => f.size <= MAX_SIZE, "File too large"),
  ),
})

export type UploadAvatarInput = v.InferInput<typeof uploadAvatarSchema>
export type UploadAvatarOutput = v.InferOutput<typeof uploadAvatarSchema>
