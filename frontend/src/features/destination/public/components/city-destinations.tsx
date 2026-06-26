import { ArrowRight } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { fetchCityDestinations } from "../lib/fetch"

type Props = {
  data: Awaited<ReturnType<typeof fetchCityDestinations>>
}

export function CityDestinations({ data }: Props) {
  if (!data.length) return null

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Destinasi Wisata
          </span>
          <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
            Jelajahi Destinasi di {data[0]?.city.name}
          </h2>
          <p className="text-body text-muted-foreground mt-3 max-w-lg">
            Temukan tempat-tempat menarik yang wajib dikunjungi saat berada di kota ini.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.city.slug}`}
              className="group bg-card overflow-hidden rounded-2xl border"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  fill
                  src={dest.image.url}
                  alt={dest.image.alt || dest.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="font-heading text-base font-bold">{dest.name}</h3>
                <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                  {dest.description}
                </p>
                <span className="text-primary hover:text-primary/80 mt-4 inline-flex items-center text-sm font-medium transition-colors">
                  Lihat Detail
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
