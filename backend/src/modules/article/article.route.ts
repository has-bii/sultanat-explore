import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  articleQuerySchema,
  articleRelatedQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from "backend/modules/article/article.schema"
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleBySlug,
  getRelatedArticles,
  listArticles,
  updateArticle,
} from "backend/modules/article/article.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const articleRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", sValidator("query", articleQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listArticles(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", async (c) => {
    const slug = c.req.param("slug")
    const article = await getArticleBySlug(slug)
    return c.json(successResponse(article, "ok"))
  })
  .get("/slug/:slug/related", sValidator("query", articleRelatedQuerySchema), async (c) => {
    const slug = c.req.param("slug")
    const query = c.req.valid("query")
    const related = await getRelatedArticles(slug, query.limit)
    return c.json(successResponse(related, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const article = await getArticle(param.id)
    return c.json(successResponse(article, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createArticleSchema), async (c) => {
    const json = c.req.valid("json")
    const article = await createArticle(json)
    return c.json(successResponse(article, "Artikel berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateArticleSchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const article = await updateArticle(param.id, json)
      return c.json(successResponse(article, "Artikel berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteArticle(param.id)
    return c.json(successResponse(null, "Artikel berhasil dihapus"))
  })

export default articleRoute
