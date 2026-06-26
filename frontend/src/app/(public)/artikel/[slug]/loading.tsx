import { ArrowLeft, Calendar, User } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

export default function ArtikelDetailLoading() {
  return (
    <main>
      {/* ArticleHero skeleton */}
      <section className="relative">
        <div className="relative h-[45vh] min-h-[360px] overflow-hidden lg:h-[55vh]">
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          <div className="from-background via-background/50 absolute inset-0 bg-linear-to-t to-transparent" />
        </div>

        <div className="absolute right-0 bottom-0 left-0">
          <div className="mx-auto max-w-4xl px-6 pb-10 lg:px-8">
            <div className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
              <ArrowLeft className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <h1 className="font-heading mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <Skeleton className="h-9 w-3/4 sm:h-10 lg:h-12" />
            </h1>

            <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <Skeleton className="h-4 w-28" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ArticleContent skeleton */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose-article space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="my-8 h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-8/12" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-7/12" />
          </div>
        </div>
      </section>
    </main>
  )
}