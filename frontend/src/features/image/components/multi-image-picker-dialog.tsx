import { ImagesIcon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

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
import dynamic from "next/dynamic"

import { ImageGridSkeleton } from "./image-grid-skeleton"

const ImageGrid = dynamic(() => import("./image-grid").then((m) => ({ default: m.ImageGrid })), {
  ssr: false,
  loading: () => (
    <div className="@container/main">
      <ImageGridSkeleton />
    </div>
  ),
})

const DEFAULT_MAX = 10

export type PickedImage = { id: string; url: string; blurHash: string }

type Props = {
  selectedImages: PickedImage[]
  onChange: (images: PickedImage[]) => void
  max?: number
}

export function MultiImagePickerDialog({ selectedImages, onChange, max = DEFAULT_MAX }: Props) {
  const [open, setOpen] = useState(false)
  const [searchLocal, setSearchLocal] = useState("")
  const [search, setSearch] = useState("")
  const [selectedImagesLocal, setSelectedImagesLocal] = useState<Map<string, PickedImage>>(
    new Map(),
  )

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchLocal), 300)
    return () => clearTimeout(timeout)
  }, [searchLocal])

  const handleOpen = () => {
    setOpen(true)
    setSelectedImagesLocal(new Map(selectedImages.map((image) => [image.id, image])))
    setSearchLocal("")
  }

  const handleClose = () => {
    setOpen(false)
    setSearchLocal("")
  }

  const handleConfirm = () => {
    onChange(Array.from(selectedImagesLocal.values()))
    handleClose()
  }

  const handleCancel = () => {
    // Revert to original value
    setSelectedImagesLocal(new Map(selectedImages.map((image) => [image.id, image])))
    handleClose()
  }

  const handleToggleImage = (image: PickedImage) => {
    setSelectedImagesLocal((prev) => {
      const next = new Map(prev)
      if (next.has(image.id)) {
        next.delete(image.id)
      } else if (next.size < max) {
        next.set(image.id, image)
      }
      return next
    })
  }

  const count = selectedImagesLocal.size
  const isAtLimit = count >= max
  const selectedIds = new Set(selectedImagesLocal.keys())

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Button type="button" variant="outline" onClick={handleOpen} className="gap-2">
        <ImagesIcon className="size-4" />
        Pilih foto{count > 0 ? ` (${count}/${max})` : ""}
      </Button>

      <DialogContent className="flex min-h-[90vh] min-w-9/10 flex-col gap-6">
        <DialogHeader className="h-fit">
          <DialogTitle>Pilih Foto</DialogTitle>
          <DialogDescription>
            Pilih foto dari library yang sudah ada.
            {isAtLimit ? (
              <span className="text-foreground font-medium"> Batas tercapai ({max} foto).</span>
            ) : (
              <span className="text-muted-foreground"> {max - count} slot tersisa.</span>
            )}
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

        <ImageGrid
          className="@container/main min-h-0 flex-1"
          query={{ limit: "10", sort: "createdAt", order: "desc", search }}
          onClearSearch={() => setSearch("")}
          selectedIds={selectedIds}
          onImageCheckedChange={({ id, url, blurHash }) => handleToggleImage({ id, url, blurHash })}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Batal
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="default" onClick={handleConfirm}>
              Pilih ({count})
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
