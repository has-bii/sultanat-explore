import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { attractions, destinations } from "../data"

export function FeaturedAttractions() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Daya Tarik Ikonik
          </span>
          <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight md:text-heading">
            atraksi yang Tak Boleh Dilewatkan
          </h2>
          <p className="mt-3 max-w-lg text-body text-muted-foreground">
            Landmark dan pengalaman yang membuat Turki menjadi destinasi dunia.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.map((attr) => {
            const dest = destinations.find((d) => d.id === attr.destinationId)

            return (
              <div
                key={attr.id}
                className="group overflow-hidden rounded-2xl bg-card shadow-uber-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    fill
                    src={attr.image}
                    alt={attr.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {dest && (
                    <span className="absolute top-3 left-3 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {dest.name}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-base font-bold">{attr.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {attr.description}
                  </p>

                  {dest && (
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Lihat {dest.name}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
