"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"

import { DestinationForm } from "../components/destination-form"
import { DestinationGallery } from "../components/destination-gallery"
import { DestinationSkeleton } from "../components/destination-skeleton"
import { useDestinationForm } from "../hooks/use-destination-form"
import { useUpdateDestination } from "../mutations/update-destination.mutation"
import { getDestinationQueryOptions } from "../queries/get-destination.query"

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

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl space-y-8">
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Edit Destinasi</CardTitle>
          <CardDescription>{/* TODO: Add description */}</CardDescription>
        </CardHeader>
        <CardContent>
          <DestinationForm mode="edit" form={form} isPending={isPending} error={error} />
        </CardContent>
      </Card>
    </div>
  )
}
