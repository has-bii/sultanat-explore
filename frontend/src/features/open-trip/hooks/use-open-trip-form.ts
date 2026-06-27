"use client"

import {
  type CreateOpenTripInput,
  createOpenTripSchema,
} from "backend/modules/open-trip/open-trip.schema"

import { useAppForm } from "../components/form/use-app-form"

interface Props {
  defaultValues?: Partial<CreateOpenTripInput>
  onSubmit: (value: CreateOpenTripInput) => Promise<void> | void
}

// ponytail: slice to YYYY-MM-DD — schema uses v.isoDate and DateField writes <input type="date"> values,
// so any incoming ISO datetime (…T00:00:00.000Z) from the backend must be normalized or onChange validation fails on load.
const toDate = (value: string | undefined): string =>
  typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : ""

export function useOpenTripForm({ defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: CreateOpenTripInput = {
    slug: _defaultValues?.slug ?? "",
    title: _defaultValues?.title ?? "",
    excerpt: _defaultValues?.excerpt ?? "",
    description: _defaultValues?.description ?? null,
    price: _defaultValues?.price ?? 0,
    coverImageId: _defaultValues?.coverImageId ?? "",
    startAt: toDate(_defaultValues?.startAt),
    endAt: toDate(_defaultValues?.endAt),
    status: _defaultValues?.status ?? "draft",
    cities: (_defaultValues?.cities ?? []).map((city) => ({
      cityId: city.cityId,
      arriveAt: toDate(city.arriveAt),
      destinations: (city.destinations ?? []).map((dest) => ({
        destinationId: dest.destinationId,
      })),
    })),
    inclusions: (_defaultValues?.inclusions ?? []).map((inc) => ({
      inclusionItemId: inc.inclusionItemId,
      type: inc.type,
    })),
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: createOpenTripSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}