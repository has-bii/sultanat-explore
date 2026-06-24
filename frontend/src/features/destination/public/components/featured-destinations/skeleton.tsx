import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedDestinationsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border">
          <Skeleton className="aspect-16/10 w-full rounded-b-none" />
          <div className="p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-2/3" />
            <Skeleton className="mt-4 h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
