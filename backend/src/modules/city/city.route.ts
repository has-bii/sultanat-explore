import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  cityQuerySchema,
  createCitySchema,
  syncGallerySchema,
  updateCitySchema,
} from "backend/modules/city/city.schema"
import {
  createCity,
  deleteCity,
  getCity,
  getCityBySlug,
  getCityGallery,
  getRelatedCities,
  listCities,
  syncGallery,
  updateCity,
} from "backend/modules/city/city.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const cityRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", sValidator("query", cityQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listCities(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", async (c) => {
    const slug = c.req.param("slug")
    const city = await getCityBySlug(slug)
    return c.json(successResponse(city, "ok"))
  })
  .get("/slug/:slug/related", async (c) => {
    const slug = c.req.param("slug")
    const cities = await getRelatedCities(slug)
    return c.json(successResponse(cities, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const city = await getCity(param.id)
    return c.json(successResponse(city, "ok"))
  })
  .get("/:id/gallery", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const gallery = await getCityGallery(param.id)
    return c.json(successResponse(gallery, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createCitySchema), async (c) => {
    const json = c.req.valid("json")
    const city = await createCity(json)
    return c.json(successResponse(city, "Kota berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateCitySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const city = await updateCity(param.id, json)
      return c.json(successResponse(city, "Kota berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteCity(param.id)
    return c.json(successResponse(null, "Kota berhasil dihapus"))
  })

  // ── Gallery ─────────────────────────────────────────────
  .put(
    "/:id/gallery",
    sValidator("param", paramIdSchema),
    sValidator("json", syncGallerySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const result = await syncGallery(param.id, json)
      return c.json(successResponse(result, "Galeri berhasil diperbarui"))
    },
  )

export default cityRoute
