"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Plus, Trash2, Undo2 } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
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

function HeaderSkeleton() {
  return (
    <div className="col-span-2 flex items-center justify-between">
      <Skeleton className="h-9 w-36" />

      <div className="inline-flex items-center gap-2">
        <Button variant="destructive" disabled>
          <Trash2 data-icon="inline-start" />
          <span>Hapus</span>
        </Button>
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

function DetailFormSkeleton() {
  return (
    <div className="flex w-full flex-col gap-0 rounded-2xl border">
      <div className="flex flex-col gap-1 border-b p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex flex-col gap-7 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="aspect-video w-full" />
          </div>
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-end gap-3">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}
