"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Undo2 } from "lucide-react"
import { lazy } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

import { DestinationForm } from "../components/destination-form"
import { DestinationGallery } from "../components/destination-gallery"
import { useDestinationForm } from "../hooks/use-destination-form"
import { useUpdateDestination } from "../mutations/update-destination.mutation"
import { getDestinationGalleryQueryOptions, getDestinationQueryOptions } from "../queries"

const DeleteDestinationDialog = lazy(() =>
  import("../components/delete-destination-dialog").then((m) => ({
    default: m.DeleteDestinationDialog,
  })),
)

interface Props {
  destinationId: string
}

export function EditDestinationPage({ destinationId }: Props) {
  const { data } = useSuspenseQuery(getDestinationQueryOptions(destinationId))

  const { mutate, isPending, error } = useUpdateDestination(destinationId)

  const form = useDestinationForm({
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

  const { data: _images } = useSuspenseQuery(getDestinationGalleryQueryOptions(destinationId))

  const images = _images.map((image) => ({ ...image.image }))

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="col-span-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.name}</h1>

        <div className="inline-flex items-center gap-2">
          <DeleteDestinationDialog destinationId={destinationId} destinationName={data.name} />
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/destination">
              <Undo2 /> Kembali
            </Link>
          </Button>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Edit Destinasi</CardTitle>
          <CardDescription>Ubah detail destinasi</CardDescription>
        </CardHeader>
        <CardContent>
          <DestinationForm mode="edit" form={form} isPending={isPending} error={error} />
        </CardContent>
      </Card>
      <DestinationGallery destinationId={destinationId} images={images} />
    </div>
  )
}
