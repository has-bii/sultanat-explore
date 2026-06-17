"use client"

import { Trash2 } from "lucide-react"

import { ButtonLoading } from "@/components/button-loading"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useDeleteUser } from "../../mutations/delete-user.mutation"
import { useDeleteUserDialogStore } from "../../stores/delete-user-dialog.store"

export function DeleteUserDialog() {
  const { open, meta, onClose } = useDeleteUserDialogStore()

  const deleteUser = useDeleteUser()
  const isPending = deleteUser.isPending

  const handleDelete = () => {
    if (!meta) return
    deleteUser.mutate(meta.id, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && !isPending && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus pengguna &ldquo;{meta?.name ?? ""}&rdquo;? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
