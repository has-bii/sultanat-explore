import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { imageQueryKeys } from "../query"

export const useBulkDeleteImages = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiClient.api.images["bulk-delete"].$post({ json: { ids } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onSettled: (_data, _error, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: imageQueryKeys.all(), exact: false })
    },
  })
}
