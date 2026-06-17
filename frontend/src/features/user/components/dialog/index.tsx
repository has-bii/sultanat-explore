"use client"

import { Plus } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SelectItem } from "@/components/ui/select"
import { useAppForm } from "@/lib/form"

import { type CreateUserInput, createUserSchema } from "backend/modules/users/users.schema"

import { useCreateUser } from "../../mutations/create-user.mutation"
import { useUserDialogStore } from "../../stores/user-dialog.store"

export function UserDialog() {
  const { open, onClose } = useUserDialogStore()

  const createUser = useCreateUser()
  const isPending = createUser.isPending

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "author" as CreateUserInput["role"],
    },
    validators: {
      onChange: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      await createUser.mutateAsync(value)
      onClose()
    },
  })

  useEffect(() => {
    if (open) form.reset()
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <DialogDescription>Buat akun baru untuk admin atau author.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Nama" placeholder="Nama lengkap" />}
          />
          <form.AppField
            name="email"
            children={(field) => <field.TextField label="Email" placeholder="email@contoh.com" />}
          />
          <form.AppField
            name="password"
            children={(field) => (
              <field.PasswordField label="Password" placeholder="Minimal 8 karakter" />
            )}
          />
          <form.AppField
            name="role"
            children={(field) => (
              <field.SelectField label="Role">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="author">Author</SelectItem>
              </field.SelectField>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
              Batal
            </Button>
            <form.AppForm>
              <form.SubmitButton label="Tambah" pendingLabel="Membuat..." icon={Plus} />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
