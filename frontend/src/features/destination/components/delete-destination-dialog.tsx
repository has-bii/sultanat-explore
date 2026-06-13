"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"

import { ButtonLoading } from "@/components/button-loading"
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
import { useRouter } from "next/navigation"

import { useDeleteDestination } from "../mutations/delete-destination.mutation"

interface Props {
  destinationId: string
  destinationName: string
}

export function DeleteDestinationDialog({ destinationId, destinationName }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const deleteMutation = useDeleteDestination()

  const handleDelete = () => {
    deleteMutation.mutate(destinationId, {
      onSuccess: () => router.push("/admin/dashboard/destination"),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 data-icon="inline-start" />
          <span>Hapus</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Destinasi</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus destinasi &ldquo;{destinationName}&rdquo;? Semua atraksi dan galeri akan ikut
            terhapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
          <ButtonLoading
            variant="destructive"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
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
