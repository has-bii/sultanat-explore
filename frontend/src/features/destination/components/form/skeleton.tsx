import { Skeleton } from "@/components/ui/skeleton"

export function DestinationFormSkeleton() {
  return (
    <div className="flex flex-col gap-7">
      {/* Name field */}
      <div className="flex w-full flex-col gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description field */}
      <div className="flex w-full flex-col gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Image picker field */}
      <div className="flex w-full flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="aspect-video w-full" />
      </div>

      {/* Submit button */}
      <div className="flex w-full flex-row items-center justify-end gap-3">
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}
