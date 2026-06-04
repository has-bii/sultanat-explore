import * as z from "zod"

export const paramIdSchema = z.object({
  id: z.uuidv7("Invalid id"),
})
