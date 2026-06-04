"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

import { IMAGE_DETAIL_QUERY_KEY } from "./use-image-detail"
import { IMAGES_QUERY_KEY } from "./use-image-list"

export function useUpdateAlt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, alt }: { id: string; alt: string }) => {
      const res = await apiClient.api.images[":id"].$patch({
        param: { id },
        json: { alt },
      })
      const data = await res.json()
      if ("error" in data) throw new Error(data.message)
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: [IMAGE_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}
