"use client"

import { KeyRound } from "lucide-react"

import { usePasswordForm } from "../hooks/use-password-form"
import { useChangePassword } from "../mutations/change-password.mutation"

export function PasswordSection() {
  const { mutate, isPending } = useChangePassword()

  const form = usePasswordForm({
    onSubmit: (value) => {
      mutate({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Keamanan</h3>
        <p className="text-muted-foreground text-sm">Ubah kata sandi akun Anda.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.AppField
          name="currentPassword"
          children={(field) => (
            <field.TextField label="Kata Sandi Saat Ini" type="password" placeholder="••••••••" />
          )}
        />

        <form.AppField
          name="newPassword"
          children={(field) => (
            <field.TextField label="Kata Sandi Baru" type="password" placeholder="••••••••" />
          )}
        />

        <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.TextField label="Konfirmasi Kata Sandi Baru" type="password" placeholder="••••••••" />
          )}
        />

        <form.AppForm>
          <form.SubmitButton
            label="Ubah Kata Sandi"
            pendingLabel="Menyimpan..."
            icon={KeyRound}
            isDisabled={isPending}
          />
        </form.AppForm>
      </form>
    </div>
  )
}
