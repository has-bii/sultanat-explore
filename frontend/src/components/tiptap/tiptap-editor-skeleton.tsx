import { Skeleton } from "@/components/ui/skeleton"

export function TiptapEditorSkeleton() {
  return (
    <div className="rounded-md border">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-1 border-b p-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="size-8 rounded-md" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
