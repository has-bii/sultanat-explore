"use client"

import * as v from "valibot"

import {
  type CreateOpenTripInput,
  createOpenTripSchema,
} from "backend/modules/open-trip/open-trip.schema"

import { useAppForm } from "../components/form/use-app-form"

// ponytail: each array row carries a runtime `_key` for stable React keys across remove/reorder.
// Valibot's default `v.object()` strips unknown keys, so it never leaks to the server; the onSubmit
// clean step also reconstructs rows explicitly as a second line of defense.
type CityIn = NonNullable<CreateOpenTripInput["cities"]>[number]
type DestIn = NonNullable<CityIn["destinations"]>[number]
type IncIn = NonNullable<CreateOpenTripInput["inclusions"]>[number]

export type OpenTripDestRow = DestIn & { _key: string }
export type OpenTripCityRow = Omit<CityIn, "destinations"> & {
  destinations: OpenTripDestRow[]
  _key: string
}
export type OpenTripInclusionRow = IncIn & { _key: string }
export type OpenTripFormValues = Omit<CreateOpenTripInput, "cities" | "inclusions"> & {
  cities: OpenTripCityRow[]
  inclusions: OpenTripInclusionRow[]
}

interface Props {
  defaultValues?: Partial<CreateOpenTripInput>
  onSubmit: (value: CreateOpenTripInput) => Promise<void> | void
}

function nextKey(): string {
  return crypto.randomUUID()
}

export function useOpenTripForm({ defaultValues: _defaultValues, onSubmit }: Props) {
  const defaultValues: OpenTripFormValues = {
    slug: _defaultValues?.slug ?? "",
    title: _defaultValues?.title ?? "",
    excerpt: _defaultValues?.excerpt ?? "",
    description: _defaultValues?.description ?? null,
    price: _defaultValues?.price ?? 0,
    coverImageId: _defaultValues?.coverImageId ?? "",
    startAt: _defaultValues?.startAt ?? "",
    endAt: _defaultValues?.endAt ?? "",
    status: _defaultValues?.status ?? "draft",
    cities: (_defaultValues?.cities ?? []).map((city) => ({
      cityId: city.cityId,
      arriveAt: city.arriveAt,
      destinations: (city.destinations ?? []).map((dest) => ({
        destinationId: dest.destinationId,
        order: dest.order,
        _key: nextKey(),
      })),
      _key: nextKey(),
    })),
    inclusions: (_defaultValues?.inclusions ?? []).map((inc) => ({
      inclusionItemId: inc.inclusionItemId,
      type: inc.type,
      _key: nextKey(),
    })),
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: ({ value }) => v.safeParse(createOpenTripSchema, value).issues,
    },
    onSubmit: async ({ value }) => {
      const { cities, inclusions, ...rest } = value
      const cleaned: CreateOpenTripInput = {
        ...rest,
        // ponytail: order is derived from array index, reindex here so duplicate/gap orders can never be submitted
        cities: (cities ?? []).map((city) => ({
          cityId: city.cityId,
          arriveAt: city.arriveAt,
          destinations: (city.destinations ?? []).map((dest, j) => ({
            destinationId: dest.destinationId,
            order: j,
          })),
        })),
        inclusions: (inclusions ?? []).map((inc) => ({
          inclusionItemId: inc.inclusionItemId,
          type: inc.type,
        })),
      }
      await onSubmit(cleaned)
    },
  })

  return form
}
