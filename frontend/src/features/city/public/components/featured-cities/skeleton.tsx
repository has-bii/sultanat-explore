import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedCitiesGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-16/10 w-full" />
      ))}
    </div>
  )
}
