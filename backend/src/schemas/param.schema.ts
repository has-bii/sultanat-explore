import * as v from "valibot"

export const paramIdSchema = v.object({
  id: v.pipe(v.string(), v.uuid("Invalid id")),
})
