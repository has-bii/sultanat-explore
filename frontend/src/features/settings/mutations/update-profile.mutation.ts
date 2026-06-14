import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

export const UPDATE_PROFILE_MUTATION_KEY = ["update-profile"] as const

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: UPDATE_PROFILE_MUTATION_KEY,
    mutationFn: async (input: { name: string }) => {
      const { data, error } = await authClient.updateUser(input)
      if (error) throw new Error(error.message || "Gagal memperbarui profil")
      return data
    },
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui")
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _err, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: ["auth"] })
    },
  })
}
