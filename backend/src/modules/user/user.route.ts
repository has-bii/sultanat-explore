import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { sValidator } from "backend/middlewares/validator-wrapper"
import { uploadAvatarSchema } from "backend/modules/user/user.schema"
import { uploadAvatar } from "backend/modules/user/user.service"
import { successResponse } from "backend/utils/response"

const userRoute = new Hono()
  .use(requireAuth)
  .post("/avatar", sValidator("form", uploadAvatarSchema), async (c) => {
    const valid = c.req.valid("form")
    const result = await uploadAvatar(valid.file)
    return c.json(successResponse(result, "Foto profil berhasil diunggah"), 201)
  })

export default userRoute
