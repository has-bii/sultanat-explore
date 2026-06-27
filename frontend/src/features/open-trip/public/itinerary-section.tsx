import { MapPin } from "lucide-react"

import { formatDate } from "../data"
import type { OpenTripCityDetail } from "./lib/fetch"

export function ItinerarySection({ cities }: { cities: OpenTripCityDetail[] }) {
  if (!cities.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold tracking-tight">Rencana Perjalanan</h2>
      <p className="text-muted-foreground mt-1 text-sm">Destinasi perjalanan Anda</p>

      <div className="relative mt-8">
        {/* Timeline line */}
        <div className="bg-border absolute top-2 bottom-2 left-[18px] w-px" />

        <div className="space-y-6">
          {cities.map((city, i) => (
            <div key={city.id} className="relative flex gap-5">
              {/* Timeline dot */}
              <div className="bg-primary text-primary-foreground relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm">
                {i + 1}
              </div>

              {/* Content */}
              <div className="bg-card hover:bg-accent/30 flex-1 rounded-xl border p-5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading flex items-center gap-2 text-base font-semibold">
                    <MapPin className="text-primary h-4 w-4" />
                    {city.city.name}
                  </h3>
                  <span className="bg-muted text-muted-foreground flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                    {formatDate(city.arriveAt)}
                  </span>
                </div>
                {city.destinations.length > 0 && (
                  <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
                    {city.destinations.map((d) => (
                      <li key={d.id} className="flex items-center gap-2">
                        <span className="bg-primary/20 h-1 w-1 rounded-full" />
                        {d.destination.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
