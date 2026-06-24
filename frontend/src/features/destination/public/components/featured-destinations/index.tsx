import { Suspense } from "react"

import { fetchFeaturedDestinations } from "../../lib/fetch"
import { FeaturedDestinationsGrid } from "./grid"
import FeaturedDestinationsGridSkeleton from "./skeleton"

export async function FeaturedDestinations() {
  const featuredDestinationsPromise = fetchFeaturedDestinations()

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Destinasi Populer
          </span>
          <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
            Destinasi Wajib Dikunjungi
          </h2>
          <p className="text-body text-muted-foreground mt-3 max-w-lg">
            Destinasi wisata terbaik yang menawarkan pengalaman tak terlupakan di Turki.
          </p>
        </div>

        <Suspense fallback={<FeaturedDestinationsGridSkeleton />}>
          <FeaturedDestinationsGrid dataPromise={featuredDestinationsPromise} />
        </Suspense>
      </div>
    </section>
  )
}
