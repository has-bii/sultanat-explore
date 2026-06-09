"use client"

import { useAppForm } from "@/lib/form"

import { type UpdateImageInput, updateImageSchema } from "backend/modules/image/image.schema"

interface Props {
  defaultValues: UpdateImageInput
  onSubmit: (value: UpdateImageInput) => void
}

export const useUpdateImageForm = ({ defaultValues, onSubmit }: Props) => {
  return useAppForm({
    defaultValues,
    validators: {
      onSubmit: updateImageSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  })
}
