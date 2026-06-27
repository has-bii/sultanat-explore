import { Skeleton } from "@/components/ui/skeleton"

export function CitiesCarouselSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[27rem] w-[320px] shrink-0 rounded-xl lg:w-[360px]" />
        ))}
      </div>
    </div>
  )
}
