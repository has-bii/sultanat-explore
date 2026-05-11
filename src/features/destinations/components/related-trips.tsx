import Link from "next/link"
import { ArrowRight, Calendar, Clock, Users } from "lucide-react"
import type { OpenTrip } from "@/features/open-trip/types"
import { formatPrice, formatDate } from "@/features/open-trip/data"

export function RelatedTrips({ trips }: { trips: OpenTrip[] }) {
  if (trips.length === 0) return null

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Open Trip
            </span>
            <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight md:text-heading">
              Trip Tersedia
            </h2>
            <p className="mt-2 max-w-lg text-body text-muted-foreground">
              Bergabung dengan open trip menuju destinasi ini bersama rombongan.
            </p>
          </div>
          <Link
            href="/open-trip"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Lihat semua trip
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/open-trip/${trip.slug}`}
              className="group overflow-hidden rounded-xl bg-card shadow-uber-sm transition-shadow hover:shadow-uber-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {formatPrice(trip.price)}/orang
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-heading text-base font-bold group-hover:text-primary transition-colors">
                  {trip.name}
                </h4>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {formatDate(trip.departureDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {trip.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {trip.availableSeats} kursi tersisa
                  </span>
                </div>

                <span className="mt-3 inline-flex items-center text-xs font-medium text-primary">
                  Lihat detail
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/open-trip"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline sm:hidden"
        >
          Lihat semua trip
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
