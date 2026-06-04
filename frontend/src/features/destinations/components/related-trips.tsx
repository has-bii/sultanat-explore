import { ArrowRight, Calendar, Clock, Users } from "lucide-react"

import { formatDate, formatPrice } from "@/features/open-trip/data"
import type { OpenTrip } from "@/features/open-trip/types"
import Image from "next/image"
import Link from "next/link"

export function RelatedTrips({ trips }: { trips: OpenTrip[] }) {
  if (trips.length === 0) return null

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Open Trip
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
              Trip Tersedia
            </h2>
            <p className="text-body text-muted-foreground mt-2 max-w-lg">
              Bergabung dengan open trip menuju destinasi ini bersama rombongan.
            </p>
          </div>
          <Link
            href="/open-trip"
            className="text-primary hidden items-center gap-1.5 text-sm font-medium hover:underline sm:inline-flex"
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
              className="group bg-card shadow-uber-sm hover:shadow-uber-md overflow-hidden rounded-xl transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  fill
                  src={trip.image}
                  alt={trip.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                <h4 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
                  {trip.name}
                </h4>

                <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="text-primary h-3.5 w-3.5" />
                    {formatDate(trip.departureDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="text-primary h-3.5 w-3.5" />
                    {trip.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="text-primary h-3.5 w-3.5" />
                    {trip.availableSeats} kursi tersisa
                  </span>
                </div>

                <span className="text-primary mt-3 inline-flex items-center text-xs font-medium">
                  Lihat detail
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/open-trip"
          className="text-primary mt-6 flex items-center justify-center gap-1.5 text-sm font-medium hover:underline sm:hidden"
        >
          Lihat semua trip
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
