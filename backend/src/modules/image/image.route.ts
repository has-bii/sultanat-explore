import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { zValidator } from "backend/middlewares/validator-wrapper"
import { updateImageSchema, uploadImageSchema } from "backend/modules/image/image.schema"
import {
  deleteImage,
  getImage,
  listImages,
  updateImage,
  uploadImage,
} from "backend/modules/image/image.service"
import { paramIdSchema } from "backend/schemas/param.schema"
import { querySchema } from "backend/schemas/query.schema"

const imageRoute = new Hono()
  .get("/", zValidator("query", querySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listImages(query.cursor, query.limit)
    return c.json(result)
  })
  .get("/:id", zValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const image = await getImage(param.id)
    return c.json(image)
  })
  .use(requireAuth)
  .post("/", zValidator("form", uploadImageSchema), async (c) => {
    const valid = c.req.valid("form")
    const image = await uploadImage(valid.file, valid.alt)
    return c.json(image, 201)
  })
  .patch(
    "/:id",
    zValidator("param", paramIdSchema),
    zValidator("json", updateImageSchema),
    async (c) => {
      const param = c.req.valid("param")
      const json = c.req.valid("json")
      const image = await updateImage(param.id, json)
      return c.json(image)
    },
  )
  .delete("/:id", zValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    await deleteImage(param.id)
    return c.body(null, 204)
  })

export default imageRoute
