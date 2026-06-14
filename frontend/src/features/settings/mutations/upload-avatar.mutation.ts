import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"

const $uploadAvatar = apiClient.api.me.avatar.$post

export const UPLOAD_AVATAR_MUTATION_KEY = ["upload-avatar"] as const

export const useUploadAvatar = () => {
  return useMutation({
    mutationKey: UPLOAD_AVATAR_MUTATION_KEY,
    mutationFn: async (file: File) => {
      const res = await $uploadAvatar({
        form: { file },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)

      const { data } = await authClient.updateUser({
        image: json.data.url,
      })
      if (!data) throw new Error("Gagal memperbarui foto profil")

      return data
    },
    onSuccess: () => {
      toast.success("Foto profil berhasil diperbarui")
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _err, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: ["auth"] })
    },
  })
}
