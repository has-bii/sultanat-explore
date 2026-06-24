"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateCityCategoryInput,
  createCityCategorySchema,
} from "backend/modules/city-category/city-category.schema"

interface Props {
  defaultValues?: Partial<CreateCityCategoryInput>
  onSubmit: (value: CreateCityCategoryInput) => Promise<void> | void
}

export function useCityCategoryForm({ defaultValues, onSubmit }: Props) {
  const defaultValuesObj: CreateCityCategoryInput = {
    name: defaultValues?.name ?? "",
  }

  const form = useAppForm({
    defaultValues: defaultValuesObj,
    validators: {
      onChange: createCityCategorySchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}