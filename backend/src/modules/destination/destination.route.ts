import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  addGalleryImageSchema,
  createDestinationSchema,
  destinationQuerySchema,
  reorderGallerySchema,
  updateDestinationSchema,
} from "backend/modules/destination/destination.schema"
import {
  addGalleryImage,
  createDestination,
  deleteDestination,
  getDestination,
  listDestinations,
  reorderGallery,
  removeGalleryImage,
  updateDestination,
} from "backend/modules/destination/destination.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const destinationRoute = new Hono()
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
  .delete(
    "/:id",
    sValidator("param", paramIdSchema),
    async (c) => {
      const param = c.req.valid("param")
      await deleteDestination(param.id)
      return c.json(successResponse(null, "Destinasi berhasil dihapus"))
    },
  )
  // Gallery endpoints
  .post(
    "/:id/gallery",
    sValidator("param", paramIdSchema),
    sValidator("json", addGalleryImageSchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const result = await addGalleryImage(param.id, json)
      return c.json(successResponse(result, "Foto berhasil ditambahkan"), 201)
    },
  )
  .delete(
    "/:id/gallery/:imageId",
    sValidator("param", paramIdSchema),
    async (c) => {
      const param = c.req.valid("param")
      const imageId = c.req.param("imageId")
      await removeGalleryImage(param.id, imageId)
      return c.json(successResponse(null, "Foto berhasil dihapus dari galeri"))
    },
  )
  .put(
    "/:id/gallery/reorder",
    sValidator("param", paramIdSchema),
    sValidator("json", reorderGallerySchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      await reorderGallery(param.id, json)
      return c.json(successResponse(null, "Urutan galeri berhasil diperbarui"))
    },
  )

export default destinationRoute
