import { Suspense } from "react"

import { fetchFeaturedCities } from "@/features/city/public/lib/fetch"

import { CitiesCarousel } from "./carousel"
import { CitiesCarouselSkeleton } from "./skeleton"

export async function CitiesSection() {
  const citiesPromise = fetchFeaturedCities()

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-subheading md:text-heading lg:text-card-title font-bold tracking-tight">
              Destinasi Populer
            </h2>
            <p className="text-body text-muted-foreground max-w-lg">
              Explore destinasi wisata Turki paling wajib Anda kunjungi
            </p>
          </div>
        </div>
      </div>
      <Suspense fallback={<CitiesCarouselSkeleton />}>
        <CitiesCarousel dataPromise={citiesPromise} />
      </Suspense>
    </section>
  )
}
