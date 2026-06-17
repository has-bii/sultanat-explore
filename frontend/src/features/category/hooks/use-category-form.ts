"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateCategoryInput,
  createCategorySchema,
} from "backend/modules/category/category.schema"

interface Props {
  defaultValues?: Partial<CreateCategoryInput>
  onSubmit: (value: CreateCategoryInput) => Promise<void> | void
}

export function useCategoryForm({ defaultValues, onSubmit }: Props) {
  const formValues: CreateCategoryInput = {
    name: defaultValues?.name ?? "",
  }

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onChange: createCategorySchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
