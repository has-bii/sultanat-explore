"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

import { IMAGES_QUERY_KEY } from "./use-image-list"

export function useDeleteImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.api.images[":id"].$delete({ param: { id } })
      const data = await res.json()
      if ("error" in data) {
        throw new Error(data.message)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
    },
  })
}
