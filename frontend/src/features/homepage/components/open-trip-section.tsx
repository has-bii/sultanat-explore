"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"

import { TripCard } from "@/features/open-trip/public/components/trip-card"
import { getPublicOpenTripsQueryOptions } from "@/features/open-trip/queries"
import Link from "next/link"

export function OpenTripSection() {
  const { data } = useSuspenseInfiniteQuery(
    getPublicOpenTripsQueryOptions({
      limit: "6",
      status: "published",
      sort: "startAt",
      order: "desc",
    }),
  )

  const trips = data.pages.flatMap((p) => p.data)

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

        {trips.length > 0 && (
          <div className="relative mt-10">
            <div className="flex scrollbar-none gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {trips.map((trip) => (
                <TripCard key={trip.slug} trip={trip} />
              ))}
            </div>
            {/* Fade edges */}
            <div className="from-background pointer-events-none absolute top-0 right-0 h-full w-16 bg-linear-to-l to-transparent" />
          </div>
        )}
      </div>
    </section>
  )
}
