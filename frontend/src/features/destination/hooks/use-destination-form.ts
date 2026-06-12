"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateDestinationInput,
  createDestinationSchema,
} from "backend/modules/destination/destination.schema"

interface Props {
  defaultValues?: CreateDestinationInput
  onSubmit: (value: CreateDestinationInput) => Promise<void> | void
}

export function useDestinationForm({ defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: CreateDestinationInput = {
    name: _defaultValues?.name ?? "",
    tagline: _defaultValues?.tagline ?? "",
    description: _defaultValues?.description ?? "",
    featured: _defaultValues?.featured ?? false,
    imageId: _defaultValues?.imageId ?? "",
    highlights: _defaultValues?.highlights ?? [""],
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
