import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ImageIcon, ImagesIcon, Loader, SearchIcon } from "lucide-react"
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
import Image from "next/image"

import { blurhashToDataUrl } from "../lib/blurhash"
import { getImageDetailQueryOptions } from "../queries"
import { ImageGridSkeleton } from "./image-grid-skeleton"

const ImageGrid = dynamic(() => import("./image-grid"), {
  ssr: false,
  loading: () => (
    <div className="@container/main">
      <ImageGridSkeleton />
    </div>
  ),
})

type Props = {
  value?: string
  onChange: (value: string) => void
}

export function ImagePickerDialog({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const [searchLocal, setSearchLocal] = useState("")
  const [search, setSearch] = useState("")

  const queryClient = useQueryClient()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    setSearchLocal("")
    setSelectedId(null)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchLocal), 300)

    return () => clearTimeout(timeout)
  }, [searchLocal])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <figure className="bg-muted/30 group relative aspect-4/3 w-full overflow-hidden rounded-4xl border">
        <SelectedImage id={value} onOpenImagePicker={handleOpen} />
      </figure>
      <DialogContent className="flex min-h-[90vh] min-w-9/10 flex-col gap-6">
        <DialogHeader className="h-fit">
          <DialogTitle>Pilih Foto</DialogTitle>
          <DialogDescription>Pilih foto dari library yang sudah ada.</DialogDescription>
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
          selectedId={selectedId || undefined}
          onImageClick={(image) => {
            setSelectedId(image.id)
            queryClient.prefetchQuery(getImageDetailQueryOptions(image.id))
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => setSelectedId(null)}>
              Batal
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              disabled={selectedId === null}
              onClick={() => selectedId && onChange(selectedId)}
            >
              Pilih
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SelectedImageProps {
  id?: string
  onOpenImagePicker: () => void
}

function SelectedImage({ id, onOpenImagePicker }: SelectedImageProps) {
  const { data, isLoading, isEnabled } = useQuery({
    ...getImageDetailQueryOptions(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center gap-2">
        <div className="inline-flex items-center gap-2">
          <Loader className="animate-spin" />
          <p className="text-base font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (data && isEnabled) {
    return (
      <>
        <Image
          src={data.url}
          alt={data.alt ?? ""}
          fill
          sizes="(max-width: 640px) 100vw, 384px"
          placeholder="blur"
          blurDataURL={blurhashToDataUrl(data.blurHash)}
          className="object-cover"
        />
        <Button
          className="absolute top-2 right-2 opacity-0 transition-[opacity,transform] group-hover:opacity-100"
          type="button"
          variant="secondary"
          onClick={onOpenImagePicker}
        >
          <ImagesIcon data-icon="inline-start" />
          <span>Ganti</span>
        </Button>
      </>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5">
      <div className="bg-muted flex size-10 items-center justify-center rounded-sm">
        <ImageIcon className="text-primary size-4.5" />
      </div>
      <p className="text-sm font-medium">Foto belum dipilih</p>
      <p className="text-muted-foreground text-sm">Pilih foto dari library yang sudah ada.</p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-2"
        onClick={onOpenImagePicker}
      >
        Pilih foto
      </Button>
    </div>
  )
}
