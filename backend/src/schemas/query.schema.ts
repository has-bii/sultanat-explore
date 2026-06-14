import * as v from "valibot"

export const cursorPaginationSchema = v.object({
  cursor: v.fallback(v.optional(v.pipe(v.string(), v.uuid("Invalid cursor"))), undefined),
  limit: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(10), v.maxValue(100)), 10),
})

export const orderDirectionSchema = v.optional(v.picklist(["asc", "desc"]), "desc")

export type CursorPaginationOutput = v.InferOutput<typeof cursorPaginationSchema>
