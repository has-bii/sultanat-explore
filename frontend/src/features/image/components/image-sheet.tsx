"use client"

import { Copy, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import { toast } from "sonner"

import { useDeleteImage } from "../hooks/use-delete-image"
import { useImageDetail } from "../hooks/use-image-detail"
import { useUpdateAlt } from "../hooks/use-update-alt"
import { blurhashToDataUrl } from "../lib/blurhash"

interface ImageSheetProps {
  imageId: string | null
  onOpenChange: (open: boolean) => void
}

export function ImageSheet({ imageId, onOpenChange }: ImageSheetProps) {
  const { data: image, isLoading } = useImageDetail(imageId)
  const updateAlt = useUpdateAlt()
  const deleteImage = useDeleteImage()

  const [altValue, setAltValue] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const altInputRef = useRef<HTMLInputElement>(null)
  const hasSetInitial = useRef(false)

  // Sync alt value when image loads
  useEffect(() => {
    if (image && !hasSetInitial.current) {
      setAltValue(image.alt ?? "")
      hasSetInitial.current = true
    }
  }, [image])

  // Reset when sheet closes
  useEffect(() => {
    if (!imageId) {
      hasSetInitial.current = false
    }
  }, [imageId])

  const handleSaveAlt = () => {
    if (!imageId || !image) return
    if (altValue === (image.alt ?? "")) return

    updateAlt.mutate(
      { id: imageId, alt: altValue },
      {
        onSuccess: () => toast.success("Alt disimpan"),
        onError: (err) => {
          setAltValue(image.alt ?? "")
          toast.error(err.message)
        },
      },
    )
  }

  const handleCopyUrl = async () => {
    if (!image) return
    await navigator.clipboard.writeText(image.url)
    toast.success("URL disalin")
  }

  const handleDelete = () => {
    if (!imageId) return
    deleteImage.mutate(imageId, {
      onSuccess: () => {
        toast.success("Foto dihapus")
        setDeleteOpen(false)
        onOpenChange(false)
      },
      onError: (err) => {
        toast.error(
          err.message.includes("ForeignKey")
            ? "Tidak dapat menghapus: foto sedang digunakan"
            : err.message,
        )
      },
    })
  }

  const open = !!imageId

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="text-heading font-heading font-bold">Detail Foto</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-neutral-100">
                <span className="text-caption text-neutral-400">Memuat...</span>
              </div>
            ) : image ? (
              <>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={image.url}
                    alt={image.alt ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, 384px"
                    placeholder="blur"
                    blurDataURL={blurhashToDataUrl(image.blurHash)}
                    className="object-contain"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-caption font-medium text-neutral-600">Alt</label>
                  <input
                    ref={altInputRef}
                    type="text"
                    value={altValue}
                    onChange={(e) => setAltValue(e.target.value)}
                    onBlur={handleSaveAlt}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveAlt()}
                    placeholder="Deskripsi gambar"
                    className="h-9 w-full rounded-sm border px-3 text-sm outline-none focus:border-neutral-400"
                    disabled={updateAlt.isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-caption font-medium text-neutral-600">URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={image.url}
                      readOnly
                      className="text-caption h-9 flex-1 rounded-sm border bg-neutral-50 px-3 text-neutral-500"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUrl}
                      className="shrink-0 rounded-full"
                    >
                      <Copy className="mr-1 size-3" />
                      Salin
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {image && (
            <div className="border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="w-full rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-2 size-4" />
                Hapus foto
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-heading font-heading font-bold">
              Hapus foto ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan tidak dapat dibatalkan. Foto akan dihapus permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteImage.isPending}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {deleteImage.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
