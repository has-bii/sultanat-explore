import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createCategorySchema,
  updateCategorySchema,
} from "backend/modules/category/category.schema"
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryBySlug,
  listCategories,
  updateCategory,
} from "backend/modules/category/category.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const categoryRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", async (c) => {
    const result = await listCategories()
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", async (c) => {
    const slug = c.req.param("slug")
    const category = await getCategoryBySlug(slug)
    return c.json(successResponse(category, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const category = await getCategory(param.id)
    return c.json(successResponse(category, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createCategorySchema), async (c) => {
    const json = c.req.valid("json")
    const category = await createCategory(json)
    return c.json(successResponse(category, "Kategori berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateCategorySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const category = await updateCategory(param.id, json)
      return c.json(successResponse(category, "Kategori berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteCategory(param.id)
    return c.json(successResponse(null, "Kategori berhasil dihapus"))
  })

export default categoryRoute
