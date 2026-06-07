import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { zValidator } from "backend/middlewares/validator-wrapper"
import {
  createAttractionCategorySchema,
  updateAttractionCategorySchema,
} from "backend/modules/attraction-category/attraction-category.schema"
import {
  createAttractionCategory,
  deleteAttractionCategory,
  getAttractionCategory,
  listAttractionCategories,
  updateAttractionCategory,
} from "backend/modules/attraction-category/attraction-category.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const attractionCategoryRoute = new Hono()
  .get("/", async (c) => {
    const categories = await listAttractionCategories()
    return c.json(successResponse(categories, "ok"))
  })
  .get("/:id", zValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const category = await getAttractionCategory(param.id)
    return c.json(successResponse(category, "ok"))
  })
  .use(requireAuth)
  .post("/", zValidator("json", createAttractionCategorySchema), async (c) => {
    const json = c.req.valid("json")
    const category = await createAttractionCategory(json)
    return c.json(successResponse(category, "Kategori berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    zValidator("param", paramIdSchema),
    zValidator("json", updateAttractionCategorySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const category = await updateAttractionCategory(param.id, json)
      return c.json(successResponse(category, "Kategori berhasil diperbarui"))
    },
  )
  .delete("/:id", zValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteAttractionCategory(param.id)
    return c.json(successResponse(null, "Kategori berhasil dihapus"))
  })

export default attractionCategoryRoute
