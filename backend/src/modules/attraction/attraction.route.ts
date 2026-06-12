import { Hono } from "hono"
import * as v from "valibot"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
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

// Param schemas per route shape
const listParamsSchema = v.object({
  destinationId: v.pipe(v.string(), v.uuid("Invalid destination id")),
})

const idParamsSchema = v.object({
  destinationId: v.pipe(v.string(), v.uuid("Invalid destination id")),
  id: v.pipe(v.string(), v.uuid("Invalid id")),
})

const attractionRoute = new Hono()
  // List attractions for a destination
  .get(
    "/",
    sValidator("param", listParamsSchema),
    sValidator("query", attractionQuerySchema),
    async (c) => {
      const { destinationId } = c.req.valid("param")
      const query = c.req.valid("query")
      const result = await listAttractions(destinationId, query)
      return c.json(successResponse(result, "ok"))
    },
  )
  // Get single attraction
  .get("/:id", sValidator("param", idParamsSchema), async (c) => {
    const { destinationId, id } = c.req.valid("param")
    const attraction = await getAttraction(destinationId, id)
    return c.json(successResponse(attraction, "ok"))
  })
  .use(requireAuth)
  // Create attraction
  .post(
    "/",
    sValidator("param", listParamsSchema),
    sValidator("json", createAttractionSchema),
    async (c) => {
      const { destinationId } = c.req.valid("param")
      const json = c.req.valid("json")
      const attraction = await createAttraction(destinationId, json)
      return c.json(successResponse(attraction, "Atraksi berhasil dibuat"), 201)
    },
  )
  // Update attraction
  .patch(
    "/:id",
    sValidator("param", idParamsSchema),
    sValidator("json", updateAttractionSchema),
    async (c) => {
      const { destinationId, id } = c.req.valid("param")
      const json = c.req.valid("json")
      const attraction = await updateAttraction(destinationId, id, json)
      return c.json(successResponse(attraction, "Atraksi berhasil diperbarui"))
    },
  )
  // Delete attraction
  .delete("/:id", sValidator("param", idParamsSchema), async (c) => {
    const { destinationId, id } = c.req.valid("param")
    await deleteAttraction(destinationId, id)
    return c.json(successResponse(null, "Atraksi berhasil dihapus"))
  })

export default attractionRoute
