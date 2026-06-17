"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateCityInput,
  createCitySchema,
} from "backend/modules/city/city.schema"

interface Props {
  defaultValues?: CreateCityInput
  onSubmit: (value: CreateCityInput) => Promise<void> | void
}

export function useCityForm({ defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: CreateCityInput = {
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
      onChange: createCitySchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
