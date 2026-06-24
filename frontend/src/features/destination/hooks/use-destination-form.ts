"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateDestinationInput,
  createDestinationSchema,
} from "backend/modules/destination/destination.schema"

interface Props {
  cityId?: string
  defaultValues?: CreateDestinationInput
  onSubmit: (value: CreateDestinationInput) => Promise<void> | void
}

export function useDestinationForm({
  cityId,
  defaultValues: _defaultValues,
  onSubmit,
}: Props) {
  const defaultValues: CreateDestinationInput = {
    cityId: _defaultValues?.cityId ?? cityId ?? "",
    name: _defaultValues?.name ?? "",
    description: _defaultValues?.description ?? "",
    imageId: _defaultValues?.imageId ?? "",
    featured: _defaultValues?.featured ?? false,
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: createDestinationSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
