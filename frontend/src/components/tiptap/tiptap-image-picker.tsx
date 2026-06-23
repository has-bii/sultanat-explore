"use client"

import { SearchIcon } from "lucide-react"
import { Suspense, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ImageGrid } from "@/features/image/components/grid"
import { ImageGridSkeleton } from "@/features/image/components/grid/skeleton"
import type { Image as TImage } from "@/features/image/types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (value: { url: string; alt?: string }) => void
}

export function TiptapImagePicker({ open, onOpenChange, onSelect }: Props) {
  const [searchLocal, setSearchLocal] = useState("")
  const search = useDebouncedValue(searchLocal, 300)
  const [selectedImage, setSelectedImage] = useState<TImage | null>(null)

  const handleClose = (value: boolean) => {
    onOpenChange(value)
    if (!value) {
      setSearchLocal("")
      setSelectedImage(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex min-h-[90vh] min-w-9/10 flex-col gap-6">
        <DialogHeader className="h-fit">
          <DialogTitle>Sisip Gambar</DialogTitle>
          <DialogDescription>
            Pilih gambar dari library untuk disisipkan ke konten.
          </DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari berdasarkan deskripsi"
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
          />
        </InputGroup>
        <Suspense
          fallback={
            <div className="@container/main">
              <ImageGridSkeleton />
            </div>
          }
        >
          <ImageGrid
            className="@container/main min-h-0 flex-1"
            query={{ limit: "10", sort: "createdAt", order: "desc", search }}
            onClearSearch={() => setSearchLocal("")}
            selectedId={selectedImage?.id}
            onImageClick={setSelectedImage}
          />
        </Suspense>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => setSelectedImage(null)}>
              Batal
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              disabled={!selectedImage}
              onClick={() =>
                selectedImage &&
                onSelect({ url: selectedImage.url, alt: selectedImage.alt || undefined })
              }
            >
              Pilih
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
