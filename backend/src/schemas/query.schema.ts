import * as z from "zod"

export const imageQuerySchema = z.object({
  cursor: z.uuidv7("Invalid cursor").optional().catch(undefined),
  limit: z.coerce.number<number>().min(10).max(100).default(10).catch(10),
  sort: z.enum(["createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional().catch(undefined),
})

export type ImageQueryInput = z.infer<typeof imageQuerySchema>

// Legacy export for other routes
export const querySchema = z.object({
  cursor: z.uuidv7("Invalid cursor").optional().catch(undefined),
  limit: z.coerce.number<number>().min(10).max(100).default(10).catch(10),
})
