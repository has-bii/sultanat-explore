import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Eksplorasi
            </span>
            <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight md:text-heading">
              Destinasi Lainnya
            </h2>
          </div>
          <Link
            href="/destinations"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
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
              className="group overflow-hidden rounded-xl bg-card shadow-uber-sm transition-shadow hover:shadow-uber-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4">
                <h4 className="font-heading text-base font-bold group-hover:text-primary transition-colors">
                  {dest.name}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {dest.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
