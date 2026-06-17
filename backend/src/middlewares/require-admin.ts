import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

import type { AppAuthContext } from "backend/app.type"

export const requireAdmin = createMiddleware<AppAuthContext>(async (c, next) => {
  const user = c.get("user")
  if (user.role !== "admin") {
    throw new HTTPException(403, { message: "Akses ditolak" })
  }
  await next()
})
