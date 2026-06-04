import { zValidator as zv } from "@hono/zod-validator"
import type { ValidationTargets } from "hono"
import { HTTPException } from "hono/http-exception"
import * as z from "zod"

export const zValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "Invalid input provided", cause: result.error })
    }
  })
