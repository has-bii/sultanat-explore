"use client"

import { KeyRound } from "lucide-react"

import { FieldGroup } from "@/components/ui/field"

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
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.AppField
          name="currentPassword"
          children={(field) => (
            <field.PasswordField label="Kata Sandi Saat Ini" placeholder="••••••••" />
          )}
        />

        <form.AppField
          name="newPassword"
          children={(field) => (
            <field.PasswordField label="Kata Sandi Baru" placeholder="••••••••" />
          )}
        />

        <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.PasswordField label="Konfirmasi Kata Sandi" placeholder="••••••••" />
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
      </FieldGroup>
    </form>
  )
}
