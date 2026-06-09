import * as v from "valibot"

// Legacy export for other routes
export const querySchema = v.object({
  cursor: v.fallback(v.optional(v.pipe(v.string(), v.uuid("Invalid cursor"))), undefined),
  limit: v.fallback(v.pipe(v.string(), v.toNumber(), v.minValue(10), v.maxValue(100)), 10),
})
