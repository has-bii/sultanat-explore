import type { ItineraryDay } from "../types"

export function ItinerarySection({ itinerary }: { itinerary: ItineraryDay[] }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold tracking-tight">Rencana Perjalanan</h2>
      <p className="mt-1 text-sm text-muted-foreground">Day-by-day itinerary perjalanan Anda</p>

      <div className="relative mt-8">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-6">
          {itinerary.map((day) => (
            <div key={day.day} className="relative flex gap-5">
              {/* Timeline dot */}
              <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                {day.day}
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border bg-card p-5 transition-colors hover:bg-accent/30">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-base font-semibold">{day.title}</h3>
                  <span className="flex-shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Hari {day.day}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {day.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
