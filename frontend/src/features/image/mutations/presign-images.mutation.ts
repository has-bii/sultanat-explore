import { useMutation } from "@tanstack/react-query"
import type { InferRequestType } from "hono"

import { apiClient } from "@/lib/api-client"

const $presign = apiClient.api.images.presign.$post
type PresignInput = InferRequestType<typeof $presign>["json"]

export const PRESIGN_IMAGES_MUTATION_KEY = ["presign-images"] as const

export const usePresignImages = () =>
  useMutation({
    mutationKey: PRESIGN_IMAGES_MUTATION_KEY,
    mutationFn: async (input: PresignInput) => {
      const res = await $presign({ json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })