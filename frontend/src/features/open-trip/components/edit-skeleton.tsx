import { Skeleton } from "@/components/ui/skeleton"

export function EditOpenTripPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Basic Info Card */}
      <div className="rounded-xl border">
        <div className="border-b p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>

      {/* Itinerary Card */}
      <div className="rounded-xl border">
        <div className="border-b p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Inclusions Card */}
      <div className="rounded-xl border">
        <div className="border-b p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <div className="p-6">
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      {/* Date Card */}
      <div className="rounded-xl border">
        <div className="border-b p-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}
