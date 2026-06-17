"use client"

import { useAppForm } from "@/lib/form"

import { type PasswordInput, passwordSchema } from "../types"

interface Props {
  onSubmit: (value: PasswordInput) => Promise<void> | void
}

export function usePasswordForm({ onSubmit }: Props) {
  const defaultValues: PasswordInput = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
