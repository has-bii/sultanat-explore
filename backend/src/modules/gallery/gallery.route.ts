import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  galleryQuerySchema,
  syncGallerySchema,
} from "backend/modules/gallery/gallery.schema"
import {
  getGalleryByType,
  syncGallery,
} from "backend/modules/gallery/gallery.service"
import { successResponse } from "backend/utils/response"

const galleryRoute = new Hono()
  // ── Public ──────────────────────────────────────────────
  .get("/", sValidator("query", galleryQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const gallery = await getGalleryByType(query.type)
    return c.json(successResponse(gallery, "ok"))
  })

  // ── Protected ───────────────────────────────────────────
  .use(requireAuth)
  .put("/", sValidator("query", galleryQuerySchema), sValidator("json", syncGallerySchema), async (c) => {
    const query = c.req.valid("query")
    const json = c.req.valid("json")
    const gallery = await syncGallery(query.type, json)
    return c.json(successResponse(gallery, "Galeri berhasil diperbarui"))
  })

export default galleryRoute
