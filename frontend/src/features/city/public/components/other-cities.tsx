import { ArrowRight } from "lucide-react"

import { fetchRelatedCities } from "@/features/city/public/lib/fetch"
import Image from "next/image"
import Link from "next/link"

interface Props {
  data: Awaited<ReturnType<typeof fetchRelatedCities>>
}

export function OtherCities({ data }: Props) {
  if (data.length === 0) return null

  return (
    <section className="py-16 lg:py-20">
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((city) => (
            <Link
              key={city.id}
              href={`/destinations/${city.slug}`}
              className="group bg-card overflow-hidden rounded-2xl border"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  fill
                  src={city.image.url}
                  alt={city.image.alt || city.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4">
                <h4 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
                  {city.name}
                </h4>
                <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">{city.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
