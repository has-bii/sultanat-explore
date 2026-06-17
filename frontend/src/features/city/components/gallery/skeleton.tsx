import { Skeleton } from "@/components/ui/skeleton"

export function CityGallerySkeleton() {
  return (
    <div className="flex w-full flex-col gap-0 rounded-2xl border">
      <div className="flex flex-col gap-1 border-b p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-4 gap-2 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  )
}
