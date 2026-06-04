import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

import type { AppAuthContext } from "backend/app.type"

export const requireAuth = createMiddleware<AppAuthContext>(async (c, next) => {
  if (!c.get("user") || !c.get("session")) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  await next()
})
