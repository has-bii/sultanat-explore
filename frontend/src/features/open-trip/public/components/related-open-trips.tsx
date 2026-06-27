import { ArrowRight, Calendar, Timer } from "lucide-react"

import { formatPrice } from "@/utils/format-price"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

import type { fetchOpenTripsByCitySlug } from "../lib/fetch"

type Trip = Awaited<ReturnType<typeof fetchOpenTripsByCitySlug>>[number]

type InclusionItem = Trip["inclusions"][number]

function getDuration(startAt: string, endAt: string): string {
  const days = Math.ceil(
    (new Date(endAt).getTime() - new Date(startAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  return `${days} Hari`
}

export function RelatedOpenTrips({ data, cityName }: { data: Trip[]; cityName: string }) {
  if (data.length === 0) return null

  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Open Trip
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
              Trip ke {cityName}
            </h2>
          </div>
          <Link
            href="/open-trip"
            className="text-primary hidden items-center gap-1.5 text-sm font-medium hover:underline sm:inline-flex"
          >
            Semua open trip
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((trip) => (
            <Link
              key={trip.slug}
              href={`/open-trip/${trip.slug}`}
              className="group bg-card block overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            >
              {/* Image */}
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  fill
                  src={trip.coverImage.url}
                  alt={trip.coverImage.alt || trip.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute right-3 bottom-3 left-3">
                  <h3 className="font-heading text-lg leading-tight font-bold text-white">
                    {trip.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Date + Duration */}
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="text-primary h-3.5 w-3.5" />
                    {format(trip.startAt, "PP", { locale: id })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Timer className="text-primary h-3.5 w-3.5" />
                    {getDuration(trip.startAt, trip.endAt)}
                  </span>
                </div>

                {/* Inclusions */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trip.inclusions.slice(0, 3).map((inc: InclusionItem) => (
                    <span
                      key={inc.inclusionItem.label}
                      className="bg-muted/60 text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px]"
                    >
                      {inc.inclusionItem.label}
                    </span>
                  ))}
                  {trip.inclusions.length > 3 && (
                    <span className="bg-muted/60 text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px]">
                      +{trip.inclusions.length - 3} lagi
                    </span>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="mt-4 flex items-end justify-between border-t pt-4">
                  <div>
                    <p className="text-primary text-xl font-bold">{formatPrice(trip.price)}</p>
                    <p className="text-muted-foreground text-[11px]">/orang</p>
                  </div>
                  <span className="text-primary flex items-center gap-1 text-sm font-medium">
                    Lihat detail
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
