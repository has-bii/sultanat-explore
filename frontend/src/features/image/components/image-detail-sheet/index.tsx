"use client"

import { useMutationState } from "@tanstack/react-query"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import dynamic from "next/dynamic"

import { updateImageMutationKey } from "../../mutations/update-image.mutation"
import { useImageDetailSheetStore } from "../../stores/image-detail-sheet.store"
import { ImageUpdateFormSkeleton } from "./image-update-form-skeleton"

const ImageUpdateForm = dynamic(
  () => import("./image-update-form").then((m) => ({ default: m.ImageUpdateForm })),
  { ssr: false, loading: () => <ImageUpdateFormSkeleton /> },
)

export function ImageSheet() {
  const { open, onClose, selectedImageId } = useImageDetailSheetStore()

  const mutation = useMutationState({
    filters: {
      mutationKey: updateImageMutationKey(selectedImageId!),
      exact: true,
    },
  })

  const handleClose = () => {
    const isPending = mutation[0]?.status === "pending"
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
          <ImageUpdateForm
            imageId={selectedImageId}
            onSuccess={onClose}
            onDeleteSuccess={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
