"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"

export const RESET_PASSWORD_MUTATION_KEY = ["reset-password"] as const

interface ResetPasswordInput {
  token: string
  password: string
}

export const useResetPassword = () => {
  return useMutation({
    mutationKey: RESET_PASSWORD_MUTATION_KEY,
    mutationFn: async ({ token, password }: ResetPasswordInput) => {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (error) {
        throw new Error(error.message ?? "Gagal reset password.")
      }
    },
  })
}
