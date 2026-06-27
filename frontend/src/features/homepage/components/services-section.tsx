import { Suspense } from "react"

import { OpenTripSection } from "./open-trip-section"
import { PrivateTripSection } from "./private-trip-section"
import { UmrahSection } from "./umrah-section"

export function ServicesSection() {
  return (
    <>
      <Suspense fallback={<OpenTripSectionSkeleton />}>
        <OpenTripSection />
      </Suspense>
      <PrivateTripSection />
      <UmrahSection />
    </>
  )
}

function OpenTripSectionSkeleton() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="bg-muted h-4 w-20 animate-pulse rounded" />
        <div className="bg-muted mt-2 h-8 w-64 animate-pulse rounded" />
        <div className="bg-muted mt-4 h-4 w-80 animate-pulse rounded" />
        <div className="mt-10 flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-[360px] w-[320px] flex-shrink-0 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  )
}
