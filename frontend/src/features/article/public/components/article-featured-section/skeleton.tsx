import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedSkeleton() {
  return (
    <div className="bg-card shadow-uber-md mt-6 block overflow-hidden rounded-2xl">
      <div className="grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="absolute top-4 left-4">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 lg:p-10">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="mt-4 h-8 w-3/4" />
          <Skeleton className="mt-2 h-8 w-1/2" />

          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />

          <Skeleton className="mt-6 h-4 w-32" />
        </div>
      </div>
    </div>
  )
}
