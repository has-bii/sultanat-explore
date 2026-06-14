import * as v from "valibot"

export const profileSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Nama wajib diisi")),
})

export const passwordSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(
      v.string(),
      v.minLength(1, "Kata sandi saat ini wajib diisi"),
    ),
    newPassword: v.pipe(
      v.string(),
      v.minLength(8, "Kata sandi baru minimal 8 karakter"),
    ),
    confirmPassword: v.pipe(v.string(), v.minLength(1, "Konfirmasi kata sandi wajib diisi")),
  }),
  v.forward(
    v.check(
      (input) => input.newPassword === input.confirmPassword,
      "Kata sandi baru tidak cocok",
    ),
    ["confirmPassword"],
  ),
)

export type ProfileInput = v.InferInput<typeof profileSchema>
export type PasswordInput = v.InferInput<typeof passwordSchema>
