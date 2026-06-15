import { Trash2 } from "lucide-react"
import { useState } from "react"

import { ButtonLoading } from "@/components/button-loading"
import { ErrorComponent } from "@/components/error-component"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { useDeleteImage } from "../mutations/delete-image.mutation"

interface Props {
  imageId: string
  onSuccess: () => void
}

export function ImageDeleteDialog({ imageId, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const { mutate, error, isPending } = useDeleteImage()

  const handleDelete = () => {
    mutate(imageId, {
      onSuccess: () => {
        setOpen(false)
        onSuccess()
      },
    })
  }

  const onOpenChange = (state: boolean) => {
    if (isPending) return
    setOpen(state)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="destructive">
          <Trash2 data-icon="inline-start" />
          <span>Hapus</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan tidak dapat dibatalkan. Foto akan dihapus permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <ErrorComponent title="Error" message={error.message} />}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <ButtonLoading
            variant="destructive"
            onClick={handleDelete}
            isLoading={isPending}
            loadingLabel="Menghapus..."
            icon={Trash2}
          >
            Hapus
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
