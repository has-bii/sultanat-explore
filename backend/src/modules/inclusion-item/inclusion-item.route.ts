import { Hono } from "hono"

import { requireAdmin } from "backend/middlewares/require-admin"
import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createInclusionItemSchema,
  inclusionItemQuerySchema,
  updateInclusionItemSchema,
} from "backend/modules/inclusion-item/inclusion-item.schema"
import {
  createInclusionItem,
  deleteInclusionItem,
  getInclusionItem,
  listInclusionItems,
  updateInclusionItem,
} from "backend/modules/inclusion-item/inclusion-item.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const inclusionItemRoute = new Hono()
  // ── All routes require admin ────────────────────────────
  .use(requireAuth)
  .use(requireAdmin)
  .get("/", sValidator("query", inclusionItemQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listInclusionItems(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")
    const item = await getInclusionItem(id)
    return c.json(successResponse(item, "ok"))
  })
  .post("/", sValidator("json", createInclusionItemSchema), async (c) => {
    const json = c.req.valid("json")
    const item = await createInclusionItem(json)
    return c.json(successResponse(item, "Inclusion item berhasil dibuat"), 201)
  })
  .put("/:id", sValidator("param", paramIdSchema), sValidator("json", updateInclusionItemSchema), async (c) => {
    const { id } = c.req.valid("param")
    const json = c.req.valid("json")
    const item = await updateInclusionItem(id, json)
    return c.json(successResponse(item, "Inclusion item berhasil diperbarui"))
  })
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")
    await deleteInclusionItem(id)
    return c.json(successResponse(null, "Inclusion item berhasil dihapus"))
  })

export default inclusionItemRoute
