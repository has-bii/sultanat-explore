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

import { useDeleteCity } from "../../mutations/delete-city.mutation"

interface Props {
  cityId: string
  cityName: string
}

export function DeleteCityDialog({ cityId, cityName }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const deleteMutation = useDeleteCity()

  const handleDelete = () => {
    deleteMutation.mutate(cityId, {
      onSuccess: () => router.push("/admin/dashboard/city"),
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
          <AlertDialogTitle>Hapus Kota</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus kota &ldquo;{cityName}&rdquo;? Semua destinasi dan galeri akan ikut
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
