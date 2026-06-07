import { Hono } from "hono"
import { z } from "zod"

import { requireAuth } from "backend/middlewares/require-auth"
import { zValidator } from "backend/middlewares/validator-wrapper"
import {
  addAttractionGalleryImageSchema,
  attractionQuerySchema,
  createAttractionSchema,
  reorderAttractionGallerySchema,
  updateAttractionSchema,
} from "backend/modules/attraction/attraction.schema"
import {
  addGalleryImage,
  createAttraction,
  deleteAttraction,
  getAttraction,
  listAttractions,
  removeGalleryImage,
  reorderGallery,
  updateAttraction,
} from "backend/modules/attraction/attraction.service"
import { successResponse } from "backend/utils/response"

// Param schemas per route shape
const listParamsSchema = z.object({
  destinationId: z.uuid("Invalid destination id"),
})

const idParamsSchema = z.object({
  destinationId: z.uuid("Invalid destination id"),
  id: z.uuid("Invalid id"),
})

const galleryImageParamsSchema = z.object({
  destinationId: z.uuid("Invalid destination id"),
  id: z.uuid("Invalid id"),
  imageId: z.uuid("Invalid image id"),
})

const attractionRoute = new Hono()
  // List attractions for a destination
  .get(
    "/",
    zValidator("param", listParamsSchema),
    zValidator("query", attractionQuerySchema),
    async (c) => {
      const { destinationId } = c.req.valid("param")
      const query = c.req.valid("query")
      const result = await listAttractions(destinationId, query)
      return c.json(successResponse(result, "ok"))
    },
  )
  // Get single attraction
  .get("/:id", zValidator("param", idParamsSchema), async (c) => {
    const { destinationId, id } = c.req.valid("param")
    const attraction = await getAttraction(destinationId, id)
    return c.json(successResponse(attraction, "ok"))
  })
  .use(requireAuth)
  // Create attraction
  .post(
    "/",
    zValidator("param", listParamsSchema),
    zValidator("json", createAttractionSchema),
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
    zValidator("param", idParamsSchema),
    zValidator("json", updateAttractionSchema),
    async (c) => {
      const { destinationId, id } = c.req.valid("param")
      const json = c.req.valid("json")
      const attraction = await updateAttraction(destinationId, id, json)
      return c.json(successResponse(attraction, "Atraksi berhasil diperbarui"))
    },
  )
  // Delete attraction
  .delete("/:id", zValidator("param", idParamsSchema), async (c) => {
    const { destinationId, id } = c.req.valid("param")
    await deleteAttraction(destinationId, id)
    return c.json(successResponse(null, "Atraksi berhasil dihapus"))
  })
  // Gallery: Add image
  .post(
    "/:id/gallery",
    zValidator("param", idParamsSchema),
    zValidator("json", addAttractionGalleryImageSchema),
    async (c) => {
      const { destinationId, id } = c.req.valid("param")
      const json = c.req.valid("json")
      const result = await addGalleryImage(destinationId, id, json)
      return c.json(successResponse(result, "Foto berhasil ditambahkan"), 201)
    },
  )
  // Gallery: Remove image
  .delete("/:id/gallery/:imageId", zValidator("param", galleryImageParamsSchema), async (c) => {
    const { destinationId, id, imageId } = c.req.valid("param")
    await removeGalleryImage(destinationId, id, imageId)
    return c.json(successResponse(null, "Foto berhasil dihapus dari galeri"))
  })
  // Gallery: Reorder
  .put(
    "/:id/gallery/reorder",
    zValidator("param", idParamsSchema),
    zValidator("json", reorderAttractionGallerySchema),
    async (c) => {
      const { destinationId, id } = c.req.valid("param")
      const json = c.req.valid("json")
      await reorderGallery(destinationId, id, json)
      return c.json(successResponse(null, "Urutan galeri berhasil diperbarui"))
    },
  )

export default attractionRoute
