import * as z from "zod"

export const paramIdSchema = z.object({
  id: z.uuid("Invalid id"),
})
