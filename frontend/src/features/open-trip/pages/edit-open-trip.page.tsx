"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Archive, Trash2, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import type { CreateOpenTripInput } from "backend/modules/open-trip/open-trip.schema"

import { OpenTripActionDialog } from "../components/dialog/delete"
import { OpenTripForm } from "../components/form"
import { useOpenTripForm } from "../hooks/use-open-trip-form"
import { useUpdateOpenTrip } from "../mutations/update-open-trip.mutation"
import { getOpenTripQueryOptions } from "../queries"
import { useOpenTripActionDialogStore } from "../stores/action-dialog.store"

interface Props {
  openTripId: string
}

export function EditOpenTripPage({ openTripId }: Props) {
  const { data: openTrip } = useSuspenseQuery(getOpenTripQueryOptions(openTripId))
  const { mutate, isPending, error } = useUpdateOpenTrip(openTripId)
  const { onOpen } = useOpenTripActionDialogStore()

  const isPublished = openTrip.status === "published"
  const isArchived = openTrip.status === "archived"

  const form = useOpenTripForm({
    defaultValues: {
      slug: openTrip.slug,
      title: openTrip.title,
      excerpt: openTrip.excerpt,
      description: openTrip.description as Record<string, unknown>,
      price: openTrip.price,
      coverImageId: openTrip.coverImageId,
      startAt: openTrip.startAt ?? undefined,
      endAt: openTrip.endAt ?? undefined,
      status: openTrip.status as "draft" | "published" | "archived",
      cities: openTrip.cities.map((city) => ({
        cityId: city.cityId,
        arriveAt: city.arriveAt,
        destinations: city.destinations.map((dest) => ({
          destinationId: dest.destinationId,
        })),
      })),
      inclusions: openTrip.inclusions.map((inc) => ({
        inclusionItemId: inc.inclusionItemId,
        type: inc.type as "include" | "exclude",
      })),
    },
    onSubmit: (value: CreateOpenTripInput) => {
      mutate(value)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="line-clamp-1 text-2xl font-semibold">{openTrip.title}</h1>
        <div className="inline-flex items-center gap-2">
          {!isArchived && (
            <Button
              variant="outline"
              onClick={() => onOpen({ id: openTripId, mode: "archive" })}
            >
              <Archive data-icon="inline-start" />
              <span>Arsipkan</span>
            </Button>
          )}
          {!isPublished && (
            <Button
              variant="destructive"
              onClick={() => onOpen({ id: openTripId, mode: "delete" })}
            >
              <Trash2 data-icon="inline-start" />
              <span>Hapus</span>
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard/open-trip">
              <Undo2 data-icon="inline-start" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>
      </div>

      <OpenTripActionDialog />
      <OpenTripForm form={form} mode="edit" isPending={isPending} error={error} />
    </div>
  )
}
