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
import { AttractionDialog } from "@/features/attraction/components/dialog"
import { DeleteAttractionDialog } from "@/features/attraction/components/dialog/delete"
import { AttractionTable } from "@/features/attraction/components/table"
import { type GetAttractionsQuery } from "@/features/attraction/queries"
import { useAttractionDialogStore } from "@/features/attraction/stores/attraction-dialog.store"
import Link from "next/link"

import { DeleteDestinationDialog } from "../components/dialog/delete"
import { DetailFormSkeleton, HeaderSkeleton } from "../components/edit-skeleton"
import { DestinationForm } from "../components/form"
import { DestinationGallery } from "../components/gallery"
import { DestinationGallerySkeleton } from "../components/gallery/skeleton"
import { useDestinationForm } from "../hooks/use-destination-form"
import { useUpdateDestination } from "../mutations/update-destination.mutation"
import { getDestinationQueryOptions } from "../queries"

interface Props {
  destinationId: string
}

function attractionQuery(destinationId: string): GetAttractionsQuery {
  return {
    destinationId,
    limit: "10",
  }
}

export function EditDestinationPage({ destinationId }: Props) {
  const openAttractionDialog = useAttractionDialogStore((s) => s.onOpen)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Header */}
      <Suspense fallback={<HeaderSkeleton />}>
        <Header destinationId={destinationId} />
      </Suspense>

      {/* Detail Form */}
      <Suspense fallback={<DetailFormSkeleton />}>
        <DetailForm destinationId={destinationId} />
      </Suspense>

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
          <Suspense fallback={<TableSkeleton rowCount={5} columns={2} />}>
            <AttractionTable query={attractionQuery(destinationId)} />
          </Suspense>
        </CardContent>
      </Card>

      <AttractionDialog destinationId={destinationId} />
      <DeleteAttractionDialog />
    </div>
  )
}

function Header({ destinationId }: Props) {
  const { data } = useSuspenseQuery(getDestinationQueryOptions(destinationId))

  return (
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
  )
}

function DetailForm({ destinationId }: Props) {
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
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>Edit Destinasi</CardTitle>
        <CardDescription>Ubah detail destinasi</CardDescription>
      </CardHeader>
      <CardContent>
        <DestinationForm mode="edit" form={form} isPending={isPending} error={error} />
      </CardContent>
    </Card>
  )
}
