import { ArrowRight, MapPin } from "lucide-react"
import { use } from "react"

import Image from "next/image"
import Link from "next/link"

import { fetchFeaturedDestinations } from "../../lib/fetch"

interface Props {
  dataPromise: ReturnType<typeof fetchFeaturedDestinations>
}

export function FeaturedDestinationsGrid({ dataPromise }: Props) {
  const data = use(dataPromise)

  return (
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
              loading="eager"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            {dest.city && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <MapPin className="h-3 w-3" />
                {dest.city.name}
              </span>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-heading text-base font-bold">{dest.name}</h3>
            <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
              {dest.description}
            </p>
            <span className="text-primary hover:text-primary/80 mt-4 inline-flex items-center text-sm font-medium transition-colors">
              Jelajahi
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
