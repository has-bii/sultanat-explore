"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { xhrUpload } from "../lib/upload"
import { IMAGES_QUERY_KEY } from "./use-image-list"

export function useUploadImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: xhrUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [IMAGES_QUERY_KEY],
        exact: false,
      })
    },
  })
}
