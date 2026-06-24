import { ArrowRight } from "lucide-react"

import { type GetCitiesResponse } from "@/features/city/queries"
import Image from "next/image"
import Link from "next/link"

interface Props {
  data: GetCitiesResponse["data"]["data"][number]
  priority?: boolean
}

export function CityCard({ data, priority }: Props) {
  return (
    <Link
      href={`/destinations/${data.slug}`}
      className="bg-card group overflow-hidden rounded-xl border transition-shadow"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          fill
          src={data.image.url}
          alt={data.image.alt ?? data.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {data.categories.map((cat) => (
            <span
              key={cat.id}
              className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
          {data.name}
        </h4>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{data.description}</p>
        <span className="text-primary mt-3 inline-flex items-center text-xs font-medium">
          Lihat detail
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
