import { TableSkeleton } from "@/components/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export function EditDestinationPageSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Header row */}
      <div className="col-span-2 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="inline-flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Detail Form card */}
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
            <Skeleton className="h-5 w-5 rounded-sm" />
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

      {/* Gallery card */}
      <div className="flex w-full flex-col gap-0 rounded-2xl border">
        <div className="flex flex-col gap-1 border-b p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-4 gap-2 p-6">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
        </div>
      </div>

      {/* Attractions card */}
      <div className="col-span-2 flex w-full flex-col gap-0 rounded-2xl border">
        <div className="flex flex-col gap-1 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <div className="px-6 pb-6">
          <TableSkeleton rowCount={5} columns={2} />
        </div>
      </div>
    </div>
  )
}
