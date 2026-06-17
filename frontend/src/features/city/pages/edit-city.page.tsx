"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Undo2 } from "lucide-react"
import { Suspense } from "react"

import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DestinationDialog } from "@/features/destination/components/dialog"
import { DeleteDestinationDialog } from "@/features/destination/components/dialog/delete"
import { DestinationTable } from "@/features/destination/components/table"
import { type GetDestinationsQuery } from "@/features/destination/queries"
import { useDestinationDialogStore } from "@/features/destination/stores/destination-dialog.store"
import Link from "next/link"

import { DeleteCityDialog } from "../components/dialog/delete"
import { DetailFormSkeleton, HeaderSkeleton } from "../components/edit-skeleton"
import { CityForm } from "../components/form"
import { CityGallery } from "../components/gallery"
import { CityGallerySkeleton } from "../components/gallery/skeleton"
import { useCityForm } from "../hooks/use-city-form"
import { useUpdateCity } from "../mutations/update-city.mutation"
import { getCityQueryOptions } from "../queries"

interface Props {
  cityId: string
}

export function EditCityPage({ cityId }: Props) {
  const openDestinationDialog = useDestinationDialogStore((s) => s.onOpen)

  const query: GetDestinationsQuery = {
    cityId,
    limit: "10",
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Header */}
      <Suspense fallback={<HeaderSkeleton />}>
        <Header cityId={cityId} />
      </Suspense>

      {/* Detail Form */}
      <Suspense fallback={<DetailFormSkeleton />}>
        <DetailForm cityId={cityId} />
      </Suspense>

      {/* Gallery */}
      <Suspense fallback={<CityGallerySkeleton />}>
        <CityGallery cityId={cityId} />
      </Suspense>

      {/* Destinations */}
      <Card className="col-span-2 w-full">
        <CardHeader>
          <CardTitle>Destinasi</CardTitle>
          <CardDescription>Kelola destinasi untuk kota ini.</CardDescription>
          <CardAction>
            <Button onClick={() => openDestinationDialog(null)}>
              <Plus data-icon="inline-start" />
              <span>Tambah</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton rowCount={5} columns={2} />}>
            <DestinationTable query={query} />
          </Suspense>
        </CardContent>
      </Card>

      <DestinationDialog cityId={cityId} />
      <DeleteDestinationDialog />
    </div>
  )
}

function Header({ cityId }: Props) {
  const { data } = useSuspenseQuery(getCityQueryOptions(cityId))

  return (
    <div className="col-span-2 flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{data.name}</h1>

      <div className="inline-flex items-center gap-2">
        <DeleteCityDialog cityId={cityId} cityName={data.name} />
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/city">
            <Undo2 data-icon="inline-start" />
            <span>Kembali</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

function DetailForm({ cityId }: Props) {
  const { data } = useSuspenseQuery(getCityQueryOptions(cityId))

  const { mutate, isPending, error } = useUpdateCity(cityId)

  const form = useCityForm({
    defaultValues: {
      name: data.name,
      description: data.description,
      tagline: data.tagline,
      highlights: data.highlights,
      imageId: data.imageId,
      featured: data.featured,
    },
    onSubmit: (value) => {
      mutate(value)
    },
  })

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>Edit Kota</CardTitle>
        <CardDescription>Ubah detail kota</CardDescription>
      </CardHeader>
      <CardContent>
        <CityForm mode="edit" form={form} isPending={isPending} error={error} />
      </CardContent>
    </Card>
  )
}
