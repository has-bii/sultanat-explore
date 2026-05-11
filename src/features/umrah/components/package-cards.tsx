import { Check, MessageCircle, Star } from "lucide-react"
import { packages, formatPrice, WHATSAPP_BASE } from "../data"

function PackageCard({ pkg }: { pkg: (typeof packages)[number] }) {
  const waText = encodeURIComponent(
    `Halo SultanatExplore, saya tertarik dengan Paket Umrah ${pkg.name} (${pkg.duration}). Mohon info lebih lanjut.`
  )

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-background shadow-uber-sm ${
        pkg.popular ? "ring-2 ring-primary" : ""
      }`}
    >
      {pkg.popular && (
        <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-3 py-1">
          <span className="text-xs font-semibold text-primary-foreground">
            Populer
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        {/* Header */}
        <div>
          <h3 className="font-heading text-xl font-bold">{pkg.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{pkg.subtitle}</p>
        </div>

        {/* Price */}
        <div className="mt-6">
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-3xl font-bold text-primary">
              {formatPrice(pkg.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {pkg.priceLabel}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{pkg.duration}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              {Array.from({ length: pkg.hotelStars }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-primary text-primary"
                />
              ))}
              <span className="ml-0.5">Hotel</span>
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-6 space-y-2">
          {pkg.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm">{h}</span>
            </div>
          ))}
        </div>

        {/* Inclusions */}
        <div className="mt-6 border-t pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Termasuk
          </p>
          <div className="mt-2 space-y-1.5">
            {pkg.inclusions.map((inc) => (
              <div key={inc} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                <span className="text-xs text-muted-foreground">{inc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 pt-4">
          <a
            href={`${WHATSAPP_BASE}${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
              pkg.popular
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-primary bg-background text-primary hover:bg-primary/5"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Tanya Paket {pkg.name}
          </a>
        </div>
      </div>
    </div>
  )
}

export function PackageCards() {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Paket Umrah
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Pilih Paket yang Sesuai
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Semua paket private — tidak digabung rombongan lain. Atau custom
            sesuai kebutuhan Anda.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  )
}
