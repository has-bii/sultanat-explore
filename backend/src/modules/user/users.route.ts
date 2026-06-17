import { Hono } from "hono"

import { requireAuth } from "backend/middlewares/require-auth"
import { requireAdmin } from "backend/middlewares/require-admin"
import { sValidator } from "backend/middlewares/validator-wrapper"
import { paramIdSchema } from "backend/schemas/param.schema"
import {
  createUserSchema,
  updateUserRoleSchema,
  userQuerySchema,
} from "backend/modules/user/users.schema"
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUserRole,
} from "backend/modules/user/users.service"
import { successResponse } from "backend/utils/response"

const usersRoute = new Hono()
  .use(requireAuth)
  .use(requireAdmin)
  .get("/", sValidator("query", userQuerySchema), async (c) => {
    const query = c.req.valid("query")
    const result = await listUsers(query)
    return c.json(successResponse(result, "ok"))
  })
  .get("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const user = await getUser(param.id)
    return c.json(successResponse(user, "ok"))
  })
  .post("/", sValidator("json", createUserSchema), async (c) => {
    const input = c.req.valid("json")
    await createUser(input)
    return c.json(successResponse(null, "Pengguna berhasil dibuat"), 201)
  })
  .patch(
    "/:id",
    sValidator("param", paramIdSchema),
    sValidator("json", updateUserRoleSchema),
    async (c) => {
      const param = c.req.valid("param")
      const input = c.req.valid("json")
      await updateUserRole(param.id, input)
      return c.json(successResponse(null, "Pengguna berhasil diperbarui"))
    },
  )
  .delete("/:id", sValidator("param", paramIdSchema), async (c) => {
    const param = c.req.valid("param")
    const user = c.get("user")
    await deleteUser(param.id, user.id)
    return c.json(successResponse(null, "Pengguna berhasil dihapus"))
  })

export default usersRoute
