"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"

import type { LoginInput } from "../dto/auth.schema"

export const LOGIN_MUTATION_KEY = ["login"] as const

export const useLogin = () => {
  return useMutation({
    mutationKey: LOGIN_MUTATION_KEY,
    mutationFn: async ({ email, password }: LoginInput) => {
      const { error } = await authClient.signIn.email({ email, password })

      if (error) {
        throw new Error(error.message ?? "Login gagal. Periksa email dan password.")
      }
    },
    onSettled: (_data, _err, _vars, _result, context) => {
      context.client.invalidateQueries({
        queryKey: ["auth"],
        exact: true,
      })
    },
  })
}
