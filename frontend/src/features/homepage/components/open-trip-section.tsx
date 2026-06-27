"use client"

import { ArrowRight, Calendar, Timer } from "lucide-react"

import { formatPrice } from "@/utils/format-price"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

import { getPublicOpenTripsQueryOptions, type GetPublicOpenTripsResponse } from "@/features/open-trip/queries"

type Trip = NonNullable<GetPublicOpenTripsResponse["data"]["data"][number]>

function getDuration(startAt: string, endAt: string): string {
  const days = Math.ceil(
    (new Date(endAt).getTime() - new Date(startAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  return `${days} Hari`
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      href={`/open-trip/${trip.slug}`}
      className="group bg-card hover:shadow-uber-md w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          fill
          src={trip.coverImage.url}
          alt={trip.coverImage.alt || trip.title}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="320px"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-4 bottom-3 left-4 flex items-end justify-between">
          <div className="text-white">
            <h4 className="font-heading text-lg leading-tight font-bold">{trip.title}</h4>
            {trip.excerpt && (
              <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{trip.excerpt}</p>
            )}
          </div>
          <span className="text-foreground rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {getDuration(trip.startAt, trip.endAt)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="text-primary h-3 w-3" />
            {format(trip.startAt, "PP", { locale: id })}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="text-primary h-3 w-3" />
            {getDuration(trip.startAt, trip.endAt)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {trip.inclusions.slice(0, 3).map((inc) => (
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

        <div className="mt-3 flex items-baseline justify-between border-t pt-3">
          <div>
            <p className="text-primary text-lg font-bold">{formatPrice(trip.price)}</p>
            <p className="text-muted-foreground text-[11px]">/orang</p>
          </div>
          <span className="bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-xs font-medium">
            Grup
          </span>
        </div>
      </div>
    </Link>
  )
}

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
