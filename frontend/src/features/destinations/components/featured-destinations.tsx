import { ArrowRight } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { getFeaturedDestinations } from "../data"

export function FeaturedDestinations() {
  const featured = getFeaturedDestinations()

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Pilihan Terbaik
          </span>
          <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
            Destinasi Unggulan
          </h2>
          <p className="text-body text-muted-foreground mt-3 max-w-lg">
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
                <Image
                  fill
                  src={dest.image}
                  alt={dest.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="text-primary-foreground absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Tersedia
                  </div>

                  <h3 className="text-xl font-bold md:text-2xl">{dest.name}</h3>

                  <p className="text-primary-foreground/70 mt-1 text-sm">{dest.tagline}</p>

                  {i === 0 && (
                    <p className="text-primary-foreground/80 mt-3 line-clamp-2 max-w-md text-sm leading-relaxed">
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
