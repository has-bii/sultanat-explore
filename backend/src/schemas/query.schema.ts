import * as z from "zod"

export const querySchema = z.object({
  cursor: z.uuidv7("Invalid cursor").optional().catch(undefined),
  limit: z.coerce.number<number>().min(10).max(100).default(10).catch(10),
})
