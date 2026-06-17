import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createDestinationSchema,
  destinationIdParamSchema,
  destinationQuerySchema,
  updateDestinationSchema,
} from "backend/modules/destination/destination.schema"
import {
  createDestination,
  deleteDestination,
  getDestination,
  listDestinations,
  updateDestination,
} from "backend/modules/destination/destination.service"
import { successResponse } from "backend/utils/response"

const destinationRoute = new Hono()
  // List all destinations (optional ?cityId filter)
  .get("/", sValidator("query", destinationQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listDestinations(query)
    return c.json(successResponse(result, "ok"))
  })
  // Get single destination
  .get("/:id", sValidator("param", destinationIdParamSchema), async (c) => {
    const { id } = c.req.valid("param")
    const destination = await getDestination(id)
    return c.json(successResponse(destination, "ok"))
  })
  .use(requireAuth)
  // Create destination
  .post("/", sValidator("json", createDestinationSchema), async (c) => {
    const json = c.req.valid("json")
    const destination = await createDestination(json)
    return c.json(successResponse(destination, "Destinasi berhasil dibuat"), 201)
  })
  // Update destination
  .patch(
    "/:id",
    sValidator("param", destinationIdParamSchema),
    sValidator("json", updateDestinationSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const json = c.req.valid("json")
      const destination = await updateDestination(id, json)
      return c.json(successResponse(destination, "Destinasi berhasil diperbarui"))
    },
  )
  // Delete destination
  .delete("/:id", sValidator("param", destinationIdParamSchema), async (c) => {
    const { id } = c.req.valid("param")
    await deleteDestination(id)
    return c.json(successResponse(null, "Destinasi berhasil dihapus"))
  })

export default destinationRoute
