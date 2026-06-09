import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import {
  bulkDeleteImageSchema,
  imageQuerySchema,
  updateImageSchema,
  uploadImageSchema,
} from "backend/modules/image/image.schema"
import {
  bulkDeleteImages,
  deleteImage,
  getImage,
  listImages,
  updateImage,
  uploadImages,
} from "backend/modules/image/image.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { successResponse } from "backend/utils/response"

const imageRoute = new Hono()
  .get("/", sValidator("query", imageQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listImages(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const image = await getImage(param.id)
    return c.json(successResponse(image, "ok"))
  })
  .use(requireAuth)
  .post("/bulk-delete", sValidator("json", bulkDeleteImageSchema), async (c) => {
    const json = c.req.valid("json")
    const result = await bulkDeleteImages(json.ids)
    return c.json(successResponse(result, "Foto berhasil dihapus"))
  })
  .post("/", sValidator("form", uploadImageSchema), async (c) => {
    const valid = c.req.valid("form")
    const images = await uploadImages(valid.files)
    const msg = "Foto berhasil diunggah"
    return c.json(successResponse(images, msg), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateImageSchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const image = await updateImage(param.id, json)
      return c.json(successResponse(image, "Foto berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteImage(param.id)
    return c.json(successResponse(null, "Foto berhasil dihapus"))
  })

export default imageRoute
