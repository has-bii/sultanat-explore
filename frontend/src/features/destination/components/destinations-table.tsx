"use client"

import { MapPin, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"

import { GetDestinationsResponse } from "../queries/get-destinations.query"

interface DestinationsTableProps {
  destinations: GetDestinationsResponse["data"]["data"]
  isLoading: boolean
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="hidden h-4 w-32 sm:block" />
      <Skeleton className="hidden h-5 w-16 sm:block" />
      <Skeleton className="hidden h-4 w-8 sm:block" />
      <Skeleton className="hidden h-4 w-8 sm:block" />
      <Skeleton className="size-8 shrink-0 rounded-full" />
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="rounded-lg border">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  )
}

export function DestinationsTable({ destinations, isLoading }: DestinationsTableProps) {
  if (isLoading) return <SkeletonTable />

  if (destinations.length === 0) return null

  return (
    <div className="rounded-lg border">
      {/* Header */}
      <div className="bg-muted/50 flex items-center gap-4 border-b px-4 py-2.5">
        <div className="text-caption text-muted-foreground min-w-0 flex-1 font-medium">Nama</div>
        <div className="text-caption text-muted-foreground hidden w-32 font-medium sm:block">
          Tagline
        </div>
        <div className="text-caption text-muted-foreground hidden w-16 font-medium sm:block">
          Unggulan
        </div>
        <div className="text-caption text-muted-foreground hidden w-8 font-medium sm:block">
          Atraksi
        </div>
        <div className="text-caption text-muted-foreground hidden w-8 font-medium sm:block">
          Galeri
        </div>
        <div className="w-8" />
      </div>

      {/* Rows */}
      {destinations.map((dest) => (
        <div
          key={dest.id}
          className="hover:bg-muted/30 flex items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0"
        >
          {/* Nama — thumbnail + name stacked */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-lg">
                {dest.image?.url ? (
                  <Image
                    src={dest.image.url}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <MapPin className="text-muted-foreground/50 size-4" />
                  </div>
                )}
              </div>
              <span className="truncate text-sm font-medium">{dest.name}</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="hidden w-32 sm:block">
            <span className="text-caption text-muted-foreground truncate">{dest.tagline}</span>
          </div>

          {/* Featured */}
          <div className="hidden w-16 sm:block">
            {dest.featured && (
              <Badge variant="secondary" className="rounded-full">
                Unggulan
              </Badge>
            )}
          </div>

          {/* Atraksi count */}
          <div className="hidden w-8 sm:block">
            <span className="text-caption text-muted-foreground">{dest._count.attractions}</span>
          </div>

          {/* Gallery count */}
          <div className="hidden w-8 sm:block">
            <span className="text-caption text-muted-foreground">{dest._count.images}</span>
          </div>

          {/* Actions */}
          <div className="w-8 shrink-0">
            <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
              <Link href={`/admin/dashboard/destination/${dest.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
