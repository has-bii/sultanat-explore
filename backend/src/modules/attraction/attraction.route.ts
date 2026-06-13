import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  attractionIdParamSchema,
  attractionQuerySchema,
  createAttractionSchema,
  updateAttractionSchema,
} from "backend/modules/attraction/attraction.schema"
import {
  createAttraction,
  deleteAttraction,
  getAttraction,
  listAttractions,
  updateAttraction,
} from "backend/modules/attraction/attraction.service"
import { successResponse } from "backend/utils/response"

const attractionRoute = new Hono()
  // List all attractions (optional ?destinationId filter)
  .get("/", sValidator("query", attractionQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listAttractions(query)
    return c.json(successResponse(result, "ok"))
  })
  // Get single attraction
  .get("/:id", sValidator("param", attractionIdParamSchema), async (c) => {
    const { id } = c.req.valid("param")
    const attraction = await getAttraction(id)
    return c.json(successResponse(attraction, "ok"))
  })
  .use(requireAuth)
  // Create attraction
  .post("/", sValidator("json", createAttractionSchema), async (c) => {
    const json = c.req.valid("json")
    const attraction = await createAttraction(json)
    return c.json(successResponse(attraction, "Atraksi berhasil dibuat"), 201)
  })
  // Update attraction
  .patch(
    "/:id",
    sValidator("param", attractionIdParamSchema),
    sValidator("json", updateAttractionSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const json = c.req.valid("json")
      const attraction = await updateAttraction(id, json)
      return c.json(successResponse(attraction, "Atraksi berhasil diperbarui"))
    },
  )
  // Delete attraction
  .delete("/:id", sValidator("param", attractionIdParamSchema), async (c) => {
    const { id } = c.req.valid("param")
    await deleteAttraction(id)
    return c.json(successResponse(null, "Atraksi berhasil dihapus"))
  })

export default attractionRoute
