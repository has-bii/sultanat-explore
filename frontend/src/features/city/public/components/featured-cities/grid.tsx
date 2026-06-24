import { ArrowRight } from "lucide-react"
import { use } from "react"

import Image from "next/image"
import Link from "next/link"

import { fetchFeaturedCities } from "../../lib/fetch"

interface Props {
  dataPromise: ReturnType<typeof fetchFeaturedCities>
}

export function FeaturedCitiesGrid({ dataPromise }: Props) {
  const data = use(dataPromise)
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {data.map((city) => (
        <Link
          key={city.id}
          href={`/destinations/${city.slug}`}
          className="bg-muted group relative aspect-16/12 w-full overflow-hidden rounded-2xl"
        >
          <Image
            fill
            src={city.image.url}
            alt={city.image.alt || ""}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content */}
          <div className="text-primary-foreground absolute inset-x-0 bottom-0 p-6 md:p-8">
            <h3 className="text-xl font-bold md:text-2xl">{city.name}</h3>

            <p className="text-primary-foreground/70 mt-1 text-sm">{city.tagline}</p>

            <p className="text-primary-foreground/80 mt-3 line-clamp-2 max-w-md text-sm leading-relaxed">
              {city.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex flex-wrap gap-1.5">
                {city.highlights.slice(0, 3).map((h) => (
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
        </Link>
      ))}
    </div>
  )
}
