import { sValidator as sV } from "@hono/standard-validator"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { ValidationTargets } from "hono"
import { HTTPException } from "hono/http-exception"

export const sValidator = <T extends StandardSchemaV1, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  sV(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "Invalid input provided", cause: result.error })
    }
  })
