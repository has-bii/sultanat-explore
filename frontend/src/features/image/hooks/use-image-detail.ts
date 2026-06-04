"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

export const IMAGE_DETAIL_QUERY_KEY = "image" as const

export function useImageDetail(id: string | null) {
  return useQuery({
    queryKey: [IMAGE_DETAIL_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) throw new Error("No image ID")
      const res = await apiClient.api.images[":id"].$get({ param: { id } })
      const data = await res.json()
      if ("error" in data) throw new Error(data.message)
      return data
    },
    enabled: !!id,
    staleTime: 30_000,
  })
}
