"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"

import { TripCard } from "@/features/open-trip/public/components/trip-card"
import { getPublicOpenTripsQueryOptions } from "@/features/open-trip/queries"
import Link from "next/link"

export function OpenTripSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Open Trip
        </span>
        <h2 className="font-heading text-subheading sm:text-heading mt-2 font-bold tracking-tight">
          Trip Hemat Healing Bareng Bestie
        </h2>
        <p className="text-body text-muted-foreground mt-4 max-w-xl">
          Solusi healing anti ribet. Jadwal dan akomodasi tinggal dinikmati.
        </p>
        <Link
          href="/open-trip"
          className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          Lihat Semua Open Trip
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Suspense fallback={<TripCardSkeleton />}>
          <TripCardList />
        </Suspense>
      </div>
    </section>
  )
}

function TripCardList() {
  const { data } = useSuspenseInfiniteQuery(
    getPublicOpenTripsQueryOptions({
      limit: "6",
      status: "published",
      sort: "startAt",
      order: "desc",
    }),
  )

  const trips = data.pages.flatMap((p) => p.data)

  if (trips.length === 0) return null

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.slug} trip={trip} />
      ))}
    </div>
  )
}

function TripCardSkeleton() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted h-[360px] animate-pulse rounded-2xl" />
      ))}
    </div>
  )
}
