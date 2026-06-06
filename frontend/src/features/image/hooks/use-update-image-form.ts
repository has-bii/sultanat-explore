"use client"

import { useForm } from "@tanstack/react-form"

import { UpdateImageInput, updateImageSchema } from "backend/modules/image/image.schema"

interface Props {
  defaultValues: UpdateImageInput
  onSubmit: (value: UpdateImageInput) => void
}

export const useUpdateImageForm = ({ defaultValues, onSubmit }: Props) => {
  return useForm({
    defaultValues,
    validators: {
      onSubmit: updateImageSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  })
}
