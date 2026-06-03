import { Hono } from "hono"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"

import type { AppContext } from "./app.type"
import { auth } from "./lib/auth"

const app = new Hono<AppContext>().basePath("/api")

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
)

app.notFound((c) => {
  return c.json({ message: "Not found" }, 404)
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }

  return c.json({ error: "Internal server error" }, 500)
})

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    })
  }

  c.set("user", session.user)
  c.set("session", session.session)
  await next()
})

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  })
})

export default app
