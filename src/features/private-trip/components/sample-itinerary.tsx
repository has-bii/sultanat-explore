import { sampleItineraries } from "../data"

export function SampleItinerary() {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Contoh Itinerary
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Inspirasi Perjalanan Anda
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Berikut contoh itinerary yang bisa kami susun. Semua bisa dicustom!
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {sampleItineraries.map((itinerary) => (
            <div
              key={itinerary.title}
              className="rounded-2xl border bg-background p-6 shadow-uber-sm transition-all hover:-translate-y-0.5 hover:shadow-uber-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-semibold">
                    {itinerary.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {itinerary.duration}
                  </p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {itinerary.priceRange}
                </span>
              </div>

              {/* City tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {itinerary.cities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {city}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              <ul className="mt-4 space-y-2">
                {itinerary.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
