import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getFeaturedDestinations } from "../data"

export function FeaturedDestinations() {
  const featured = getFeaturedDestinations()

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Pilihan Terbaik
          </span>
          <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight md:text-heading">
            Destinasi Unggulan
          </h2>
          <p className="mt-3 max-w-lg text-body text-muted-foreground">
            Destinasi paling populer yang direkomendasikan tim kami untuk perjalanan pertama Anda ke
            Turki.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((dest, i) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* First item spans full width on large screens */}
              <div
                className={`relative overflow-hidden ${i === 0 ? "h-80 md:h-96" : "h-72 md:h-80"}`}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-primary-foreground">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Tersedia
                  </div>

                  <h3 className="text-xl font-bold md:text-2xl">{dest.name}</h3>

                  <p className="mt-1 text-sm text-primary-foreground/70">{dest.tagline}</p>

                  {i === 0 && (
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80 line-clamp-2">
                      {dest.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {dest.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs backdrop-blur-sm"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <span className="ml-auto flex items-center text-sm font-medium">
                      Selengkapnya{" "}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
