import { ArrowRight } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import type { Destination } from "../types"

export function OtherDestinations({
  destinations,
  currentSlug,
}: {
  destinations: Destination[]
  currentSlug: string
}) {
  const others = destinations.filter((d) => d.slug !== currentSlug).slice(0, 4)

  if (others.length === 0) return null

  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Eksplorasi
            </span>
            <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
              Destinasi Lainnya
            </h2>
          </div>
          <Link
            href="/destinations"
            className="text-primary hidden items-center gap-1.5 text-sm font-medium hover:underline sm:inline-flex"
          >
            Semua destinasi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group bg-card shadow-uber-sm hover:shadow-uber-md overflow-hidden rounded-xl transition-shadow"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  fill
                  src={dest.image}
                  alt={dest.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4">
                <h4 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
                  {dest.name}
                </h4>
                <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">{dest.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
