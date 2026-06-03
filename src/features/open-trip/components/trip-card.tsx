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
      className="group block overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          fill
          src={trip.image}
          alt={trip.name}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Seat badge top-right */}
        <div className="absolute top-3 right-3">
          <SeatBadge available={trip.availableSeats} total={trip.totalSeats} />
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-heading text-lg font-bold leading-tight text-white">{trip.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
            <MapPin className="h-3 w-3" />
            {trip.destination}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formatDate(trip.departureDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {trip.duration}
          </span>
        </div>

        {/* Inclusions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trip.inclusions.slice(0, 3).map((inc) => (
            <span
              key={inc.label}
              className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              <span>{inc.icon}</span>
              {inc.label}
            </span>
          ))}
          {trip.inclusions.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
              +{trip.inclusions.length - 3} lagi
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-xl font-bold text-primary">{formatPrice(trip.price)}</p>
            <p className="text-[11px] text-muted-foreground">/orang</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-primary ">
            Lihat detail
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
