"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus, Undo2 } from "lucide-react"
import { Suspense, lazy } from "react"

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
import { AttractionDialog, DeleteAttractionDialog } from "@/features/attraction"
import { AttractionTable } from "@/features/attraction/components/attraction-table"
import { useAttractionDialogStore } from "@/features/attraction/stores/attraction-dialog.store"
import Link from "next/link"

import { DestinationForm } from "../components/destination-form"
import { DestinationGallery } from "../components/destination-gallery"
import { useDestinationForm } from "../hooks/use-destination-form"
import { useUpdateDestination } from "../mutations/update-destination.mutation"
import { getDestinationQueryOptions } from "../queries"

const DeleteDestinationDialog = lazy(() =>
  import("../components/delete-destination-dialog").then((m) => ({
    default: m.DeleteDestinationDialog,
  })),
)

interface Props {
  destinationId: string
}

export default function EditDestinationPage({ destinationId }: Props) {
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
              <Undo2 /> Kembali
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
      <DestinationGallery destinationId={destinationId} />

      {/* Attractions */}
      <Card className="col-span-2 w-full">
        <CardHeader>
          <CardTitle>Atraksi</CardTitle>
          <CardDescription>Kelola atraksi untuk destinasi ini.</CardDescription>
          <CardAction>
            <Button onClick={() => openAttractionDialog(null)}>
              <Plus data-icon="inline-start" />
              Tambah
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton rowCount={5} columns={2} />}>
            <AttractionTable destinationId={destinationId} />
          </Suspense>
        </CardContent>
      </Card>

      <AttractionDialog destinationId={destinationId} />
      <DeleteAttractionDialog />
    </div>
  )
}
