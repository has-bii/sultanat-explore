"use client"

import { useAppForm } from "@/lib/form"

import { type ProfileInput, profileSchema } from "../types"

interface Props {
  defaultValues?: ProfileInput
  onSubmit: (value: ProfileInput) => Promise<void> | void
}

export function useProfileForm({ defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: ProfileInput = {
    name: _defaultValues?.name ?? "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
