import { Check, X, MessageCircle } from "lucide-react"
import type { Inclusion } from "../types"
import { formatPrice, WHATSAPP_BASE } from "../data"
import type { OpenTrip } from "../types"

export function InclusionSection({ trip }: { trip: OpenTrip }) {
  const waText = encodeURIComponent(
    `Halo SultanatExplore, saya tertarik dengan Open Trip "${trip.name}" pada ${trip.departureDate}. Apakah masih tersedia?`,
  )
  const waLink = `${WHATSAPP_BASE}${waText}`

  return (
    <section className="space-y-8">
      {/* Highlights */}
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Highlight Perjalanan
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {trip.highlights.map((h) => (
            <span
              key={h}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
            >
              ✦ {h}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Inclusions */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-4 w-4" />
            </span>
            Termasuk
          </h3>
          <ul className="mt-4 space-y-2.5">
            {trip.inclusions.map((inc) => (
              <li
                key={inc.label}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px]">
                  {inc.icon}
                </span>
                {inc.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-foreground">
              <X className="h-4 w-4" />
            </span>
            Tidak Termasuk
          </h3>
          <ul className="mt-4 space-y-2.5">
            {trip.exclusions.map((exc) => (
              <li
                key={exc}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <X className="h-3.5 w-3.5 text-foreground/40" />
                {exc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price + WhatsApp CTA */}
      <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-sm text-muted-foreground">Mulai dari</p>
        <p className="mt-1 font-heading text-3xl font-bold text-primary">
          {formatPrice(trip.price)}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            /orang
          </span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {trip.duration} · {trip.availableSeats} kursi tersisa dari{" "}
          {trip.totalSeats}
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:shadow-uber-pressed"
        >
          <MessageCircle className="h-5 w-5" />
          Pesan via WhatsApp
        </a>
      </div>
    </section>
  )
}
