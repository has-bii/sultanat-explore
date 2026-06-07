import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

import { IMAGES_QUERY_KEY } from "../query/get-images.query"

interface UseBulkDeleteImagesOptions {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export const useBulkDeleteImages = ({ onSuccess, onError }: UseBulkDeleteImagesOptions = {}) => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiClient.api.images["bulk-delete"].$post({ json: { ids } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: () => {
      onSuccess?.()
    },
    onError: (e) => {
      onError?.(e.message)
    },
    onSettled: (_data, _error, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: [IMAGES_QUERY_KEY], exact: false })
    },
  })
}
