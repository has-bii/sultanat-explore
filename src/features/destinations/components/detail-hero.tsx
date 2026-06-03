import { ArrowLeft, MapPin } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import { categoryLabels } from "../data"
import type { Destination } from "../types"

export function DetailHero({ destination }: { destination: Destination }) {
  return (
    <section className="relative">
      <div className="relative h-[45vh] min-h-[360px] overflow-hidden lg:h-[55vh]">
        <Image
          fill
          src={destination.image}
          alt={destination.name}
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="from-background via-background/50 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <div className="absolute right-0 bottom-0 left-0">
        <div className="mx-auto max-w-6xl px-6 pb-10 lg:px-8">
          <Link
            href="/destinations"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Destinasi
          </Link>

          <div className="mt-4 flex flex-wrap gap-2">
            {destination.categories.map((cat) => (
              <span
                key={cat}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
              >
                {categoryLabels[cat]}
              </span>
            ))}
          </div>

          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {destination.name}
          </h1>

          <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-base">
            <MapPin className="text-primary h-4 w-4" />
            {destination.tagline}
          </p>
        </div>
      </div>
    </section>
  )
}
