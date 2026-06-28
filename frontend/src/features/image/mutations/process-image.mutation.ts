import { useMutation } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

import { imageQueryKeys } from "../queries"

// ponytail: invalidation target for 409/404 spans detail + list — siblings
// (delete/update) already invalidate both unconditionally on settle, which
// is a superset of the PRD's per-status needs. Match siblings over branching.
const $processImage = apiClient.api.images[":id"].process.$post

export const PROCESS_IMAGE_MUTATION_KEY = ["process-image"] as const

export const useProcessImage = () => {
  return useMutation({
    mutationKey: PROCESS_IMAGE_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $processImage({ param: { id } })
      const json = await res.json()
      if (!json.success) {
        // Carry status out so onError can distinguish the 409/404/400 cases
        // (whose server messages already match the PRD toasts) from 500/other
        // (which the PRD overrides to "Gagal memproses foto").
        throw Object.assign(new Error(json.message), { status: res.status })
      }
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (err: Error & { status?: number }) => {
      const known = [409, 404, 400].includes(err.status ?? 0)
      toast.error(known ? err.message : "Gagal memproses foto")
    },
    onSettled: (_res, _err, id, _result, context) => {
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.detail(id),
        exact: true,
      })
      context.client.invalidateQueries({
        queryKey: imageQueryKeys.all(),
        exact: false,
      })
    },
  })
}