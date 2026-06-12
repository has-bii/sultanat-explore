import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createDestinationSchema,
  destinationQuerySchema,
  syncGallerySchema,
  updateDestinationSchema,
} from "backend/modules/destination/destination.schema"
import {
  createDestination,
  deleteDestination,
  getDestination,
  getDestinationGallery,
  listDestinations,
  syncGallery,
  updateDestination,
} from "backend/modules/destination/destination.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const destinationRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", sValidator("query", destinationQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listDestinations(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const destination = await getDestination(param.id)
    return c.json(successResponse(destination, "ok"))
  })
  .get("/:id/gallery", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const gallery = await getDestinationGallery(param.id)
    return c.json(successResponse(gallery, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .post("/", sValidator("json", createDestinationSchema), async (c) => {
    const json = c.req.valid("json")
    const destination = await createDestination(json)
    return c.json(successResponse(destination, "Destinasi berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateDestinationSchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const destination = await updateDestination(param.id, json)
      return c.json(successResponse(destination, "Destinasi berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteDestination(param.id)
    return c.json(successResponse(null, "Destinasi berhasil dihapus"))
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

export default destinationRoute
