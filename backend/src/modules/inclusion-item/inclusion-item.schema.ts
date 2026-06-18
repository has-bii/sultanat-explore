import * as v from "valibot"

export const createInclusionItemSchema = v.object({
  label: v.pipe(v.string(), v.minLength(1, "Label harus diisi"), v.maxLength(200, "Label maksimal 200 karakter")),
})

export const updateInclusionItemSchema = v.object({
  label: v.optional(v.pipe(v.string(), v.minLength(1, "Label harus diisi"), v.maxLength(200, "Label maksimal 200 karakter"))),
})

export type CreateInclusionItemInput = v.InferInput<typeof createInclusionItemSchema>
export type UpdateInclusionItemInput = v.InferInput<typeof updateInclusionItemSchema>
