import { sampleItineraries } from "../data"

export function SampleItinerary() {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Contoh Itinerary
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Inspirasi Perjalanan Anda
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Berikut contoh itinerary yang bisa kami susun. Semua bisa dicustom!
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {sampleItineraries.map((itinerary) => (
            <div
              key={itinerary.title}
              className="bg-background shadow-uber-sm hover:shadow-uber-md rounded-2xl border p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-semibold">{itinerary.title}</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">{itinerary.duration}</p>
                </div>
                <span className="bg-primary text-primary-foreground flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                  {itinerary.priceRange}
                </span>
              </div>

              {/* City tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {itinerary.cities.map((city) => (
                  <span
                    key={city}
                    className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {city}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              <ul className="mt-4 space-y-2">
                {itinerary.highlights.map((h) => (
                  <li key={h} className="text-muted-foreground flex items-start gap-2 text-sm">
                    <span className="bg-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
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
