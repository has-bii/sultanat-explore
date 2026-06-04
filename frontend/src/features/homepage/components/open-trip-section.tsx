import { ArrowRight, Car, Hotel, MapPin, Mic, Plane, Utensils } from "lucide-react"

import Image from "next/image"

import type { Inclusion, Trip } from "../data"
import { openTripService } from "../data"

const inclusionIconMap: Record<string, React.ReactNode> = {
  "✈️": <Plane className="h-3 w-3" />,
  "🏨": <Hotel className="h-3 w-3" />,
  "🚌": <Car className="h-3 w-3" />,
  "🚗": <Car className="h-3 w-3" />,
  "🍽️": <Utensils className="h-3 w-3" />,
  "🎤": <Mic className="h-3 w-3" />,
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="group bg-card hover:shadow-uber-md w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          fill
          src={trip.image}
          alt={trip.name}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="320px"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-4 bottom-3 left-4 flex items-end justify-between">
          <div className="text-white">
            <h4 className="font-heading text-lg leading-tight font-bold">{trip.name}</h4>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
              <MapPin className="h-3 w-3" />
              {trip.destination}
            </p>
          </div>
          <span className="text-foreground rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {trip.duration}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {trip.inclusions.slice(0, 4).map((inc: Inclusion) => (
            <span
              key={inc.label}
              className="bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]"
            >
              {inclusionIconMap[inc.icon] ?? <span>{inc.icon}</span>}
              {inc.label}
            </span>
          ))}
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
    </div>
  )
}

export function OpenTripSection() {
  const { title, heading, description, trips, href, ctaText } = openTripService

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          {title}
        </span>
        <h2 className="font-heading text-subheading sm:text-heading mt-2 font-bold tracking-tight">
          {heading}
        </h2>
        <p className="text-body text-muted-foreground mt-4 max-w-xl">{description}</p>
        <a
          href={href}
          className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </a>

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
