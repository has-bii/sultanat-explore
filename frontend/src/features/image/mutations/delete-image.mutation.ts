import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { imageQueryKeys } from "../queries"

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.images[":id"].$delete({ param: { id } })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.message)
      }
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (e) => {
      toast.error(e.message)
    },
    onSettled: (_data, _error, vars, _result, context) => {
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.all(),
        exact: false,
      })
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.detail(vars),
        exact: true,
      })
    },
  })
}
