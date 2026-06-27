import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { formatDate, formatPrice } from "../data"
import type { OpenTrip } from "../types"

function SeatBadge({ available }: { available: number }) {
  const isEmpty = available === 0
  const isAlmostEmpty = available > 0 && available <= 3

  const variant = isEmpty
    ? "bg-destructive text-destructive-foreground"
    : isAlmostEmpty
      ? "bg-amber-500 text-white"
      : "bg-primary text-primary-foreground"

  const label = isEmpty
    ? "Penuh!"
    : isAlmostEmpty
      ? `Hampir penuh! ${available} kursi`
      : `${available} kursi tersisa`

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-md ${variant}`}
    >
      <Users className="h-3 w-3" />
      {label}
    </span>
  )
}

export function TripCard({ trip }: { trip: OpenTrip }) {
  return (
    <Link
      href={`/open-trip/${trip.slug}`}
      className="group bg-card block overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          fill
          src={trip.image}
          alt={trip.name}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Seat badge top-right */}
        <div className="absolute top-3 right-3">
          <SeatBadge available={trip.availableSeats} />
        </div>

        {/* Bottom overlay */}
        <div className="absolute right-4 bottom-3 left-4">
          <h3 className="font-heading text-lg leading-tight font-bold text-white">{trip.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
            <MapPin className="h-3 w-3" />
            {trip.destination}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta row */}
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <Calendar className="text-primary h-3.5 w-3.5" />
            {formatDate(trip.departureDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="text-primary h-3.5 w-3.5" />
            {trip.duration}
          </span>
        </div>

        {/* Inclusions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trip.inclusions.slice(0, 3).map((inc) => (
            <span
              key={inc.label}
              className="bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]"
            >
              <span>{inc.icon}</span>
              {inc.label}
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
  )
}
