import { ArrowRight, Calendar, Timer } from "lucide-react"

import { formatPrice } from "@/utils/format-price"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

import { GetPublicOpenTripsResponse } from "../../queries"

type Trip = NonNullable<GetPublicOpenTripsResponse["data"]["data"][number]>

function getDuration(startAt: string, endAt: string): string {
  const days = Math.ceil(
    (new Date(endAt).getTime() - new Date(startAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  return `${days} Hari`
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
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
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Bottom overlay */}
        <div className="absolute right-4 bottom-3 left-4">
          <h3 className="font-heading text-lg leading-tight font-bold text-white">{trip.title}</h3>
          {trip.excerpt && (
            <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{trip.excerpt}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta row */}
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
