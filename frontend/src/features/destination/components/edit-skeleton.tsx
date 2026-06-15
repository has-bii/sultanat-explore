import { Trash2, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function HeaderSkeleton() {
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

export function DetailFormSkeleton() {
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
