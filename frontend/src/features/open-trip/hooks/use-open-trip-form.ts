"use client"

import { useAppForm } from "../components/form/use-app-form"

import {
  type CreateOpenTripInput,
  createOpenTripSchema,
} from "backend/modules/open-trip/open-trip.schema"

interface Props {
  defaultValues?: Partial<CreateOpenTripInput>
  onSubmit: (value: CreateOpenTripInput) => Promise<void> | void
}

export function useOpenTripForm({ defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: CreateOpenTripInput = {
    slug: _defaultValues?.slug ?? "",
    title: _defaultValues?.title ?? "",
    excerpt: _defaultValues?.excerpt ?? "",
    description: _defaultValues?.description ?? null,
    price: _defaultValues?.price ?? 0,
    coverImageId: _defaultValues?.coverImageId ?? "",
    startAt: _defaultValues?.startAt ?? undefined,
    endAt: _defaultValues?.endAt ?? undefined,
    status: _defaultValues?.status ?? "draft",
    cities: _defaultValues?.cities ?? [],
    inclusions: _defaultValues?.inclusions ?? [],
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: createOpenTripSchema,
    },
    onSubmit: async ({ value }) => {
      const cleaned: CreateOpenTripInput = {
        ...value,
        cities: (value.cities ?? []).map((city) => ({
          ...city,
          departAt: city.departAt || undefined,
          destinations: city.destinations ?? [],
        })),
        startAt: value.startAt || undefined,
        endAt: value.endAt || undefined,
      }
      await onSubmit(cleaned)
    },
  })

  return form
}
