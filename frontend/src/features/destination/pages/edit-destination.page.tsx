"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus, Undo2 } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AttractionDialog } from "@/features/attraction/components/attraction-dialog"
import { AttractionTable } from "@/features/attraction/components/attraction-table"
import { AttractionTableSkeleton } from "@/features/attraction/components/attraction-table-skeleton"
import { DeleteAttractionDialog } from "@/features/attraction/components/delete-attraction-dialog"
import { useAttractionDialogStore } from "@/features/attraction/stores/attraction-dialog.store"
import Link from "next/link"

import { DeleteDestinationDialog } from "../components/delete-destination-dialog"
import { DestinationForm } from "../components/destination-form"
import { DestinationGallery } from "../components/destination-gallery"
import { DestinationGallerySkeleton } from "../components/destination-gallery"
import { useDestinationForm } from "../hooks/use-destination-form"
import { useUpdateDestination } from "../mutations/update-destination.mutation"
import { getDestinationQueryOptions } from "../queries"

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

  const openAttractionDialog = useAttractionDialogStore((s) => s.onOpen)

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.name}</h1>

        <div className="inline-flex items-center gap-2">
          <DeleteDestinationDialog destinationId={destinationId} destinationName={data.name} />
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/destination">
              <Undo2 data-icon="inline-start" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Detail Form */}
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Edit Destinasi</CardTitle>
          <CardDescription>Ubah detail destinasi</CardDescription>
        </CardHeader>
        <CardContent>
          <DestinationForm mode="edit" form={form} isPending={isPending} error={error} />
        </CardContent>
      </Card>

      {/* Gallery */}
      <Suspense fallback={<DestinationGallerySkeleton />}>
        <DestinationGallery destinationId={destinationId} />
      </Suspense>

      {/* Attractions */}
      <Card className="col-span-2 w-full">
        <CardHeader>
          <CardTitle>Atraksi</CardTitle>
          <CardDescription>Kelola atraksi untuk destinasi ini.</CardDescription>
          <CardAction>
            <Button onClick={() => openAttractionDialog(null)}>
              <Plus data-icon="inline-start" />
              <span>Tambah</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<AttractionTableSkeleton />}>
            <AttractionTable destinationId={destinationId} />
          </Suspense>
        </CardContent>
      </Card>

      <AttractionDialog destinationId={destinationId} />
      <DeleteAttractionDialog />
    </div>
  )
}
