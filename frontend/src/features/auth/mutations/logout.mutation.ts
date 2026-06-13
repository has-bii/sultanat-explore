import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useLogout = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()

      if (error) throw new Error(error.message || "Gagal logout")
    },
    onMutate: () => ({
      toastId: toast.loading("Logging out..."),
    }),
    onSuccess: () => {
      toast.success("Berhasil logout")
      router.push("/admin/login")
    },
    onError: (err) => toast.error(err.message),
    onSettled: (_data, _err, _vars, result) => {
      if (result?.toastId) toast.dismiss(result.toastId)
    },
  })
}
