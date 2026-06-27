import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

export default function OpenTripDetailLoading() {
  return (
    <main>
      {/* Header skeleton */}
      <section className="relative">
        <div className="relative h-[40vh] min-h-[320px] overflow-hidden lg:h-[50vh]">
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>

        <div className="absolute right-0 bottom-0 left-0">
          <div className="mx-auto max-w-6xl px-6 pb-8 lg:px-8">
            <div className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
              <ArrowLeft className="h-4 w-4" />
              <Skeleton className="h-4 w-36" />
            </div>

            <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <Skeleton className="h-9 w-3/4 sm:h-10 lg:h-12" />
            </h1>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="text-primary h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="text-primary h-4 w-4" />
                <Skeleton className="h-4 w-28" />
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="text-primary h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="mx-auto max-w-6xl space-y-16 px-6 py-16 lg:px-8 lg:py-20">
        {/* Description skeleton */}
        <div className="prose-article space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-9/12" />
          <Skeleton className="my-8 h-48 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-8/12" />
        </div>
      </section>
    </main>
  )
}
