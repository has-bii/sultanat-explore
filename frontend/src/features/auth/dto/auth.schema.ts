import * as v from "valibot"

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email("Email tidak valid")),
  password: v.pipe(v.string(), v.minLength(1, "Password wajib diisi")),
})
export type LoginInput = v.InferOutput<typeof loginSchema>

export const forgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email("Email tidak valid")),
})
export type ForgotPasswordInput = v.InferOutput<typeof forgotPasswordSchema>

export const resetPasswordSchema = v.pipe(
  v.object({
    password: v.pipe(v.string(), v.minLength(8, "Password minimal 8 karakter")),
    confirmPassword: v.pipe(v.string(), v.minLength(1, "Konfirmasi password wajib diisi")),
  }),
  v.forward(
    v.check((data) => data.password === data.confirmPassword, "Password tidak cocok"),
    ["confirmPassword"],
  ),
)
export type ResetPasswordInput = v.InferOutput<typeof resetPasswordSchema>
