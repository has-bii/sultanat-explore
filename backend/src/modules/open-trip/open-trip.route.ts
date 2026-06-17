import { Hono } from "hono"

import { requireAdmin } from "backend/middlewares/require-admin"
import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  createOpenTripSchema,
  openTripQuerySchema,
  openTripSlugParamSchema,
  updateOpenTripSchema,
} from "backend/modules/open-trip/open-trip.schema"
import {
  createOpenTrip,
  deleteOpenTrip,
  getOpenTripById,
  getOpenTripBySlug,
  listOpenTrips,
  updateOpenTrip,
} from "backend/modules/open-trip/open-trip.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const openTripRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", sValidator("query", openTripQuerySchema), async (c) => {
    const query = c.req.valid("query")
    // Public: hard-filter published, ignore status param
    const result = await listOpenTrips(query, false)
    return c.json(successResponse(result, "ok"))
  })
  .get("/slug/:slug", sValidator("param", openTripSlugParamSchema), async (c) => {
    const { slug } = c.req.valid("param")
    const openTrip = await getOpenTripBySlug(slug)
    return c.json(successResponse(openTrip, "ok"))
  })

  // ── Admin (requireAuth + requireAdmin) ──────────────────
  .use(requireAuth)
  .use(requireAdmin)
  // Admin list: all statuses, honors status filter
  .get("/admin", sValidator("query", openTripQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listOpenTrips(query, true)
    return c.json(successResponse(result, "ok"))
  })
  // Admin detail by id
  .get("/admin/:id", sValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")
    const openTrip = await getOpenTripById(id)
    return c.json(successResponse(openTrip, "ok"))
  })
  .post("/", sValidator("json", createOpenTripSchema), async (c) => {
    const json = c.req.valid("json")
    const openTrip = await createOpenTrip(json)
    return c.json(successResponse(openTrip, "Open Trip berhasil dibuat"), 201)
  })
  .put("/:id", sValidator("param", paramIdSchema), sValidator("json", updateOpenTripSchema), async (c) => {
    const { id } = c.req.valid("param")
    const json = c.req.valid("json")
    const openTrip = await updateOpenTrip(id, json)
    return c.json(successResponse(openTrip, "Open Trip berhasil diperbarui"))
  })
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")
    await deleteOpenTrip(id)
    return c.json(successResponse(null, "Open Trip berhasil diarsipkan"))
  })

export default openTripRoute
