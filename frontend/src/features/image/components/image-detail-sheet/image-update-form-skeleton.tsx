import { Skeleton } from "@/components/ui/skeleton"

export function ImageUpdateFormSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Skeleton className="aspect-4/3 w-full" />

      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="mt-2 h-9 w-full" />
      </div>
    </div>
  )
}
