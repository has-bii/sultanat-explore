import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { InferRequestType } from "hono"
import { toast } from "sonner"

import { cityQueryKeys } from "../queries"

const $syncGallery = apiClient.api.cities[":id"].gallery.$put

export const UPDATE_GALLERY_MUTATION_KEY = ["update-gallery"] as const

export const useUpdateGallery = (cityId: string) => {
  return useMutation({
    mutationKey: [...UPDATE_GALLERY_MUTATION_KEY, cityId],
    mutationFn: async (input: InferRequestType<typeof $syncGallery>["json"]) => {
      const res = await $syncGallery({ param: { id: cityId }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSettled: (_res, _err, _var, _result, context) => {
      context.client.invalidateQueries({
        queryKey: cityQueryKeys.gallery(cityId),
        exact: true,
      })
    },
  })
}
