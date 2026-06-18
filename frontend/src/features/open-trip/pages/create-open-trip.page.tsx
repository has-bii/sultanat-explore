"use client"

import { useRouter } from "next/navigation"

import type { CreateOpenTripInput } from "backend/modules/open-trip/open-trip.schema"

import { OpenTripForm } from "../components/form"
import { useOpenTripForm } from "../hooks/use-open-trip-form"
import { useCreateOpenTrip } from "../mutations/create-open-trip.mutation"

export function CreateOpenTripPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateOpenTrip()

  const onSubmit = async (value: CreateOpenTripInput) => {
    mutate(value, {
      onSuccess: () => {
        router.push("/admin/dashboard/open-trip")
      },
    })
  }

  const form = useOpenTripForm({ onSubmit })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tambah Open Trip</h1>
        <p className="text-muted-foreground text-sm">Buat open trip baru</p>
      </div>

      <OpenTripForm form={form} mode="create" isPending={isPending} error={error} />
    </div>
  )
}
