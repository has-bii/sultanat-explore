import { Hono } from "hono"
import type { ApplyGlobalResponse } from "hono/client"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"

import type { AppContext } from "backend/app.type"
import { auth } from "backend/lib/auth"
import attractionCategoryRoute from "backend/modules/attraction-category/attraction-category.route"
import destinationRoute from "backend/modules/destination/destination.route"
import imageRoute from "backend/modules/image/image.route"
import { errorResponse } from "backend/utils/response"

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
  return c.json(errorResponse("Tidak ditemukan", "Tidak ditemukan"), 404)
})

app.onError((err, c) => {
  console.error(err)

  if (err instanceof HTTPException) {
    return c.json(errorResponse(err.message, err.cause || err.message), err.status)
  }

  return c.json(errorResponse("Terjadi kesalahan server", "Terjadi kesalahan server"), 500)
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
    return
  }
  c.set("user", null)
  c.set("session", null)
  await next()
})

const routes = app
  .route("/images", imageRoute)
  .route("/attraction-categories", attractionCategoryRoute)
  .route("/destinations", destinationRoute)

export default routes
export type AppType = ApplyGlobalResponse<
  typeof routes,
  {
    404: {
      json: {
        success: false
        data: null
        message: string
        error: any
      }
    }
    500: {
      json: {
        success: false
        data: null
        message: string
        error: any
      }
    }
  }
>
