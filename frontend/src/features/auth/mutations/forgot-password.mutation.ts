"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"

export const FORGOT_PASSWORD_MUTATION_KEY = ["forgot-password"] as const

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: FORGOT_PASSWORD_MUTATION_KEY,
    mutationFn: async (email: string) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/admin/reset-password",
      })

      if (error) {
        throw new Error(error.message ?? "Gagal mengirim email reset.")
      }
    },
  })
}
