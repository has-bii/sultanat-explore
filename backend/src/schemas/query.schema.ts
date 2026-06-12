import * as v from "valibot"

// Legacy export for other routes
export const querySchema = v.object({
  cursor: v.optional(v.pipe(v.string(), v.uuid("Invalid cursor"))),
  limit: v.optional(v.pipe(v.string(), v.toNumber(), v.minValue(10), v.maxValue(100)), "10"),
})

export type QueryInput = v.InferInput<typeof querySchema>
export type QueryOutput = v.InferOutput<typeof querySchema>
