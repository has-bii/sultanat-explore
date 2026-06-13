"use client"

import { useAppForm } from "@/lib/form"

import {
  type CreateAttractionInput,
  createAttractionSchema,
} from "backend/modules/attraction/attraction.schema"

interface Props {
  destinationId?: string
  defaultValues?: CreateAttractionInput
  onSubmit: (value: CreateAttractionInput) => Promise<void> | void
}

export function useAttractionForm({ destinationId, defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: CreateAttractionInput = {
    destinationId: _defaultValues?.destinationId ?? destinationId ?? "",
    name: _defaultValues?.name ?? "",
    description: _defaultValues?.description ?? "",
    imageId: _defaultValues?.imageId ?? "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: createAttractionSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}
