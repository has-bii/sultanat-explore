import { Skeleton } from "@/components/ui/skeleton"

export function CategoryFilterSkeleton() {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-28 border" />
      ))}
    </div>
  )
}
