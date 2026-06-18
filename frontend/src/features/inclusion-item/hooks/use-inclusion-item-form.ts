"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateInclusionItemInput,
  createInclusionItemSchema,
} from "backend/modules/inclusion-item/inclusion-item.schema"

interface Props {
  defaultValues?: Partial<CreateInclusionItemInput>
  onSubmit: (value: CreateInclusionItemInput) => Promise<void> | void
}

export function useInclusionItemForm({ defaultValues, onSubmit }: Props) {
  const formValues: CreateInclusionItemInput = {
    label: defaultValues?.label ?? "",
  }

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onChange: createInclusionItemSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
