import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

export const CHANGE_PASSWORD_MUTATION_KEY = ["change-password"] as const

export const useChangePassword = () => {
  return useMutation({
    mutationKey: CHANGE_PASSWORD_MUTATION_KEY,
    mutationFn: async (input: {
      currentPassword: string
      newPassword: string
    }) => {
      const { data, error } = await authClient.changePassword(input)
      if (error) throw new Error(error.message || "Gagal mengubah kata sandi")
      return data
    },
    onSuccess: () => {
      toast.success("Kata sandi berhasil diubah")
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _err, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: ["auth"] })
    },
  })
}
