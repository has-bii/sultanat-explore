import { Hono } from "hono"
import type { ApplyGlobalResponse } from "hono/client"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"

import type { AppContext } from "backend/app.type"
import { auth } from "backend/lib/auth"
import imageRoute from "backend/modules/image/image.route"

const app = new Hono<AppContext>().basePath("/api")

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
)

app.notFound((c) => {
  return c.json({ message: "Not found", error: "Not found" }, 404)
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message, error: err.cause || err.message }, err.status)
  }

  return c.json({ message: "Internal server error", error: "Internal server error" }, 500)
})

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (session) {
    c.set("user", session.user)
    c.set("session", session.session)
    await next()
  }
  c.set("user", null)
  c.set("session", null)
  await next()
})

const routes = app.route("/images", imageRoute)

export default routes
export type AppType = ApplyGlobalResponse<
  typeof routes,
  {
    500: {
      json: {
        message: string
        error: any
      }
    }
  }
>
