import { Suspense } from "react"

import { fetchFeaturedArticles } from "../../lib/fetch"
import { Featured } from "./featured"
import { FeaturedSkeleton } from "./skeleton"

export function ArticleFeaturedSection() {
  const dataPromise = fetchFeaturedArticles()

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <span className="text-primary text-sm font-medium tracking-wider uppercase">
          Artikel Pilihan
        </span>

        <Suspense fallback={<FeaturedSkeleton />}>
          <Featured dataPromise={dataPromise} />
        </Suspense>
      </div>
    </section>
  )
}
