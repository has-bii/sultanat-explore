import { useMutation } from "@tanstack/react-query"
import type { InferRequestType } from "hono"

import { apiClient } from "@/lib/api-client"

const $confirm = apiClient.api.images.confirm.$post
type ConfirmInput = InferRequestType<typeof $confirm>["json"]

export const CONFIRM_IMAGES_MUTATION_KEY = ["confirm-images"] as const

export const useConfirmImages = () =>
  useMutation({
    mutationKey: CONFIRM_IMAGES_MUTATION_KEY,
    mutationFn: async (input: ConfirmInput) => {
      const res = await $confirm({ json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })