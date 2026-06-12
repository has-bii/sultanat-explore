import { Skeleton } from "@/components/ui/skeleton"

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

export function DestinationTableSkeleton() {
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
