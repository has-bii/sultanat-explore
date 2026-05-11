import {
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Utensils,
  Mic,
  MapPin,
} from "lucide-react";
import { openTripService } from "../data";
import type { Inclusion, Trip } from "../data";

const inclusionIconMap: Record<string, React.ReactNode> = {
  "✈️": <Plane className="h-3 w-3" />,
  "🏨": <Hotel className="h-3 w-3" />,
  "🚌": <Car className="h-3 w-3" />,
  "🚗": <Car className="h-3 w-3" />,
  "🍽️": <Utensils className="h-3 w-3" />,
  "🎤": <Mic className="h-3 w-3" />,
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="group w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-uber-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="text-white">
            <h4 className="font-heading text-lg font-bold leading-tight">
              {trip.name}
            </h4>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
              <MapPin className="h-3 w-3" />
              {trip.destination}
            </p>
          </div>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
            {trip.duration}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {trip.inclusions.slice(0, 4).map((inc: Inclusion) => (
            <span
              key={inc.label}
              className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {inclusionIconMap[inc.icon] ?? <span>{inc.icon}</span>}
              {inc.label}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t pt-3">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatPrice(trip.price)}
            </p>
            <p className="text-[11px] text-muted-foreground">/orang</p>
          </div>
          <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Grup
          </span>
        </div>
      </div>
    </div>
  );
}

export function OpenTripSection() {
  const { trips } = openTripService;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Open Trip
        </span>
        <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight sm:text-heading">
          Jelajahi Bersama, Hemat Bersama
        </h2>
        <p className="mt-4 max-w-xl text-body text-muted-foreground">
          {openTripService.description}
        </p>
        <a
          href={openTripService.href}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {openTripService.ctaText}
          <ArrowRight className="h-4 w-4" />
        </a>

        {trips.length > 0 && (
          <div className="relative mt-10">
            <div className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {trips.map((trip) => (
                <TripCard key={trip.slug} trip={trip} />
              ))}
            </div>
            {/* Fade edges */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
