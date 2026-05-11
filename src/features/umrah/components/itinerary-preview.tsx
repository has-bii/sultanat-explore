"use client"

import { useState } from "react"
import { ChevronDown, MapPin } from "lucide-react"
import { itineraryDays } from "../data"

export function ItineraryPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="border-y bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Itinerary
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Contoh Perjalanan 9 Hari
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Itinerary dapat disesuaikan sesuai paket dan preferensi Anda
          </p>
        </div>

        <div className="mt-10 space-y-2">
          {itineraryDays.map((day, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={day.day}
                className="overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-uber-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {day.day}
                    </span>
                    <div>
                      <span className="text-sm font-semibold">{day.title}</span>
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {day.location}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 pl-16 text-sm leading-relaxed text-muted-foreground">
                      {day.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
