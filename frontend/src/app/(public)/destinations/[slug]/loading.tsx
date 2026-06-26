import { Skeleton } from "@/components/ui/skeleton"

export default function DestinationDetailLoading() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative">
        <Skeleton className="h-[45vh] min-h-[360px] w-full rounded-none lg:h-[55vh]" />
        <div className="absolute right-0 bottom-0 left-0">
          <div className="mx-auto max-w-6xl px-6 pb-10 lg:px-8">
            <Skeleton className="h-4 w-40" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-10 w-64 sm:h-12 lg:h-14" />
            <Skeleton className="mt-2 h-5 w-48" />
          </div>
        </div>
      </section>

      {/* 2. About + Highlights */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-4 h-5 w-full" />
              <Skeleton className="mt-3 h-5 w-full" />
              <Skeleton className="mt-3 h-5 w-11/12" />
              <Skeleton className="mt-3 h-5 w-3/4" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-4 w-28" />
              <ul className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Gallery — section is bg-muted, override skeleton to bg-foreground/10 for contrast */}
      <section className="bg-muted py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Skeleton className="bg-foreground/10 h-4 w-20" />
          <Skeleton className="bg-foreground/10 mt-2 h-8 w-48 sm:h-10" />
          <Skeleton className="bg-foreground/10 mt-8 aspect-16/10 w-full rounded-2xl" />
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="bg-foreground/10 aspect-4/3 w-24 shrink-0 rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
