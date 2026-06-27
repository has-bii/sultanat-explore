import { Skeleton } from "@/components/ui/skeleton"

export function TripListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border">
          <Skeleton className="aspect-4/3 w-full" />
          <div className="space-y-3 p-5">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-end justify-between border-t pt-4">
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
