import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createCityCategorySchema,
  updateCityCategorySchema,
} from "backend/modules/city-category/city-category.schema"
import {
  createCityCategory,
  deleteCityCategory,
  getCityCategory,
  getCityCategoryBySlug,
  listCityCategories,
  updateCityCategory,
} from "backend/modules/city-category/city-category.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const cityCategoryRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", async (c) => {
    const result = await listCityCategories()
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", async (c) => {
    const slug = c.req.param("slug")
    const category = await getCityCategoryBySlug(slug)
    return c.json(successResponse(category, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const category = await getCityCategory(param.id)
    return c.json(successResponse(category, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createCityCategorySchema), async (c) => {
    const json = c.req.valid("json")
    const category = await createCityCategory(json)
    return c.json(successResponse(category, "Kategori kota berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateCityCategorySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const category = await updateCityCategory(param.id, json)
      return c.json(successResponse(category, "Kategori kota berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteCityCategory(param.id)
    return c.json(successResponse(null, "Kategori kota berhasil dihapus"))
  })

export default cityCategoryRoute