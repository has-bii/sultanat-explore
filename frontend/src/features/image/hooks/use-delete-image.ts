"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

import { IMAGES_QUERY_KEY } from "./use-image-list"

export function useDeleteImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.images[":id"].$delete({ param: { id } })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.message || "Delete failed")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
    },
  })
}
