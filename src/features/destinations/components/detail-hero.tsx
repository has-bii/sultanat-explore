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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 pb-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Destinasi
          </Link>

          <div className="mt-4 flex flex-wrap gap-2">
            {destination.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {categoryLabels[cat]}
              </span>
            ))}
          </div>

          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {destination.name}
          </h1>

          <p className="mt-2 flex items-center gap-1.5 text-base text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {destination.tagline}
          </p>
        </div>
      </div>
    </section>
  )
}
