import { Suspense } from "react"

import { fetchFeaturedCities } from "../../lib/fetch"
import { FeaturedCitiesGrid } from "./grid"
import FeaturedCitiesGridSkeleton from "./skeleton"

export async function FeaturedCities() {
  const featuredCitiesPromise = fetchFeaturedCities()

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Pilihan Terbaik
          </span>
          <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
            Kota Pilihan
          </h2>
          <p className="text-body text-muted-foreground mt-3 max-w-lg">
            Kota paling populer yang direkomendasikan untuk perjalanan pertama Anda ke Turki.
          </p>
        </div>

        <Suspense fallback={<FeaturedCitiesGridSkeleton />}>
          <FeaturedCitiesGrid dataPromise={featuredCitiesPromise} />
        </Suspense>
      </div>
    </section>
  )
}
