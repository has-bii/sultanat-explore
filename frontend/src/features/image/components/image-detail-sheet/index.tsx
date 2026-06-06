"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useImageDetailSheetStore } from "../../stores/image-detail-sheet.store"
import { Inner } from "./inner"

export function ImageSheet() {
  const { open, onClose, selectedImageId } = useImageDetailSheetStore()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="border-b">
          <SheetTitle>Detail Foto</SheetTitle>
          <SheetDescription>Ganti foto deskripsi atau hapus foto</SheetDescription>
        </SheetHeader>
        {selectedImageId && <Inner imageId={selectedImageId} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  )
}
