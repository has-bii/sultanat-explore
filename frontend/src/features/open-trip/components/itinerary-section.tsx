import type { ItineraryDay } from "../types"

export function ItinerarySection({ itinerary }: { itinerary: ItineraryDay[] }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold tracking-tight">Rencana Perjalanan</h2>
      <p className="text-muted-foreground mt-1 text-sm">Day-by-day itinerary perjalanan Anda</p>

      <div className="relative mt-8">
        {/* Timeline line */}
        <div className="bg-border absolute top-2 bottom-2 left-[18px] w-px" />

        <div className="space-y-6">
          {itinerary.map((day) => (
            <div key={day.day} className="relative flex gap-5">
              {/* Timeline dot */}
              <div className="bg-primary text-primary-foreground relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm">
                {day.day}
              </div>

              {/* Content */}
              <div className="bg-card hover:bg-accent/30 flex-1 rounded-xl border p-5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-base font-semibold">{day.title}</h3>
                  <span className="bg-muted text-muted-foreground flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                    Hari {day.day}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
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
