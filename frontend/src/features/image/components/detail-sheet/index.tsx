"use client"

import { useMutationState } from "@tanstack/react-query"
import { Suspense } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { PROCESS_IMAGE_MUTATION_KEY } from "../../mutations/process-image.mutation"
import { UPDATE_IMAGE_MUTATION_KEY } from "../../mutations/update-image.mutation"
import { useImageDetailSheetStore } from "../../stores/image-detail-sheet.store"
import { ImageUpdateForm } from "./update-form"
import { ImageUpdateFormSkeleton } from "./update-form-skeleton"

export function ImageSheet() {
  const { open, onClose, meta: selectedImageId } = useImageDetailSheetStore()

  const updateMutation = useMutationState({
    filters: {
      mutationKey: [...UPDATE_IMAGE_MUTATION_KEY, selectedImageId!],
      exact: true,
    },
  })
  const processMutation = useMutationState({
    filters: {
      mutationKey: PROCESS_IMAGE_MUTATION_KEY,
      exact: true,
    },
  })

  const handleClose = () => {
    const isPending =
      updateMutation[0]?.status === "pending" ||
      processMutation[0]?.status === "pending"
    if (isPending) return
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader className="border-b">
          <SheetTitle>Detail Foto</SheetTitle>
          <SheetDescription>Ganti foto deskripsi atau hapus foto</SheetDescription>
        </SheetHeader>
        {selectedImageId && (
          <Suspense fallback={<ImageUpdateFormSkeleton />}>
            <ImageUpdateForm
              imageId={selectedImageId}
              onSuccess={onClose}
              onDeleteSuccess={onClose}
            />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  )
}
