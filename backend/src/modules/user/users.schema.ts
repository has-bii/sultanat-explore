import * as v from "valibot"

export const createUserSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama harus diisi"),
    v.maxLength(100, "Nama maksimal 100 karakter"),
  ),
  email: v.pipe(v.string(), v.email("Email tidak valid")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password minimal 8 karakter"),
    v.maxLength(128, "Password maksimal 128 karakter"),
  ),
  role: v.picklist(["admin", "author"], "Role tidak valid"),
})

export const updateUserRoleSchema = v.object({
  role: v.picklist(["admin", "author"], "Role tidak valid"),
})

export const userQuerySchema = v.object({
  sort: v.optional(v.picklist(["createdAt", "name"]), "createdAt"),
  order: v.optional(v.picklist(["asc", "desc"]), "desc"),
})

export type CreateUserInput = v.InferInput<typeof createUserSchema>
export type UpdateUserRoleInput = v.InferInput<typeof updateUserRoleSchema>
export type UserQueryInput = v.InferInput<typeof userQuerySchema>
export type UserQueryOutput = v.InferOutput<typeof userQuerySchema>
