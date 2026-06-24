import { Skeleton } from "@/components/ui/skeleton"

export function CitiesGridSkeleton() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl border" />
      ))}
    </div>
  )
}
