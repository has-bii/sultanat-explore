"use client"

import { useCallback, useMemo, useReducer, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { Image } from "../types"
import { imageQueryKeys } from "../queries"
import { usePresignImages } from "../mutations/presign-images.mutation"
import { useConfirmImages } from "../mutations/confirm-images.mutation"
import { uploadToR2 } from "../lib/upload-to-r2"

// --- Types ---

export type UploadStatus =
  | "queued"
  | "presigning"
  | "uploading"
  | "confirming"
  | "done"
  | "error"

export interface UploadItem {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
  result?: Image
}

// --- Reducer ---

type Action =
  | { type: "ADD"; files: File[] }
  | { type: "REMOVE"; id: string }
  | { type: "SET_STATUS"; id: string; status: UploadStatus }
  | { type: "SET_PROGRESS"; id: string; progress: number }
  | { type: "SET_RESULT"; id: string; result: Image }
  | { type: "SET_ERROR"; id: string; error: string }
  | { type: "RESET" }

function reducer(state: UploadItem[], action: Action): UploadItem[] {
  switch (action.type) {
    case "ADD": {
      const existingNames = new Set(state.map((i) => i.file.name))
      const newItems: UploadItem[] = []
      for (const file of action.files) {
        if (existingNames.has(file.name)) continue
        existingNames.add(file.name)
        newItems.push({
          id: crypto.randomUUID(),
          file,
          status: "queued",
          progress: 0,
        })
      }
      return [...state, ...newItems]
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id)
    case "SET_STATUS":
      return state.map((i) =>
        i.id === action.id
          ? { ...i, status: action.status, progress: action.status === "uploading" ? 0 : i.progress }
          : i,
      )
    case "SET_PROGRESS":
      return state.map((i) => (i.id === action.id ? { ...i, progress: action.progress } : i))
    case "SET_RESULT":
      return state.map((i) =>
        i.id === action.id ? { ...i, status: "done", progress: 100, result: action.result } : i,
      )
    case "SET_ERROR":
      return state.map((i) =>
        i.id === action.id ? { ...i, status: "error", error: action.error } : i,
      )
    case "RESET":
      return []
  }
}

// --- Concurrency helper ---

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  const executing = new Set<Promise<void>>()
  for (const item of items) {
    const p = fn(item).then(() => {
      executing.delete(p)
    })
    executing.add(p)
    if (executing.size >= concurrency) {
      await Promise.race(executing)
    }
  }
  await Promise.all(executing)
}

// --- Hook ---

export function useUploadQueue() {
  const [items, dispatch] = useReducer(reducer, [])
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const queryClient = useQueryClient()
  const presign = usePresignImages()
  const confirm = useConfirmImages()

  const addFiles = useCallback((files: FileList | File[]) => {
    dispatch({ type: "ADD", files: Array.from(files) })
  }, [])

  const removeItem = useCallback((id: string) => {
    const controller = abortControllersRef.current.get(id)
    if (controller) {
      controller.abort()
      abortControllersRef.current.delete(id)
    }
    dispatch({ type: "REMOVE", id })
  }, [])

  const processItem = useCallback(
    async (item: UploadItem): Promise<"done" | "error" | "aborted"> => {
      const controller = new AbortController()
      abortControllersRef.current.set(item.id, controller)

      try {
        // Step 1: Presign
        dispatch({ type: "SET_STATUS", id: item.id, status: "presigning" })
        const contentType = item.file.type as "image/jpeg" | "image/png" | "image/webp"
        const [presigned] = await presign.mutateAsync({
          files: [{ contentType, fileSize: item.file.size }],
        })

        // Step 2: Upload to R2
        dispatch({ type: "SET_STATUS", id: item.id, status: "uploading" })
        await uploadToR2({
          url: presigned.url,
          file: item.file,
          contentType: item.file.type,
          signal: controller.signal,
          onProgress: (p) => dispatch({ type: "SET_PROGRESS", id: item.id, progress: p }),
        })

        // Step 3: Confirm
        dispatch({ type: "SET_STATUS", id: item.id, status: "confirming" })
        const [image] = await confirm.mutateAsync({
          items: [{ key: presigned.key, fileSize: item.file.size }],
        })

        dispatch({ type: "SET_RESULT", id: item.id, result: image })
        return "done"
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return "aborted"
        const message = err instanceof Error ? err.message : "Gagal mengunggah foto"
        dispatch({ type: "SET_ERROR", id: item.id, error: message })
        toast.error(`${item.file.name}: ${message}`)
        return "error"
      } finally {
        abortControllersRef.current.delete(item.id)
      }
    },
    [presign, confirm],
  )

  const startUpload = useCallback(async () => {
    const queued = items.filter((i) => i.status === "queued")
    if (queued.length === 0) return

    const results = new Map<string, "done" | "error" | "aborted">()

    await runWithConcurrency(queued, 3, async (item) => {
      const result = await processItem(item)
      results.set(item.id, result)
    })

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: imageQueryKeys.all(), exact: false })

    // Toast summary
    const doneCount = [...results.values()].filter((r) => r === "done").length
    const failedCount = [...results.values()].filter((r) => r === "error").length

    if (doneCount > 0 && failedCount === 0) {
      toast.success(`${doneCount} foto berhasil diunggah`)
    } else if (doneCount > 0 && failedCount > 0) {
      toast.success(`${doneCount} foto berhasil diunggah, ${failedCount} gagal`)
    }
    // If all failed, per-file error toasts already shown
  }, [items, processItem, queryClient])

  const retryItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id)
      if (!item || item.status !== "error") return

      // Reset to queued so UI shows it's retrying
      dispatch({ type: "SET_STATUS", id, status: "queued" })

      const result = await processItem({ ...item, status: "queued", progress: 0, error: undefined })

      if (result === "done") {
        queryClient.invalidateQueries({ queryKey: imageQueryKeys.all(), exact: false })
        toast.success(`${item.file.name} berhasil diunggah`)
      }
    },
    [items, processItem, queryClient],
  )

  const reset = useCallback(() => {
    for (const controller of abortControllersRef.current.values()) {
      controller.abort()
    }
    abortControllersRef.current.clear()
    dispatch({ type: "RESET" })
  }, [])

  const isUploading = useMemo(
    () => items.some((i) => ["presigning", "uploading", "confirming"].includes(i.status)),
    [items],
  )

  const summary = useMemo(() => {
    let done = 0
    let failed = 0
    let pending = 0
    for (const item of items) {
      if (item.status === "done") done++
      else if (item.status === "error") failed++
      else pending++
    }
    return { done, failed, pending }
  }, [items])

  return {
    items,
    addFiles,
    removeItem,
    startUpload,
    retryItem,
    reset,
    isUploading,
    summary,
  }
}