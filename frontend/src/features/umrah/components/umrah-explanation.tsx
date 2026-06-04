import { Lock, MapPin, Shield } from "lucide-react"

import Image from "next/image"

export function UmrahExplanation() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1592326871020-04f58c1a52f3?w=800&h=600&fit=crop"
                alt="Masjidil Haram"
                width={800}
                height={600}
                className="h-80 w-full object-cover lg:h-105"
                loading="lazy"
              />
            </div>
            {/* Floating card */}
            <div className="bg-background shadow-uber-md absolute -right-4 -bottom-4 rounded-2xl border p-4 sm:-right-6 sm:-bottom-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <MapPin className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Makkah & Madinah</p>
                  <p className="text-muted-foreground text-xs">Hotel dekat Masjid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              Private Umrah
            </span>
            <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
              Ibadah Nyaman Dengan Pelayanan Exclusive
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Kami menghadirkan layanan umrah private yang berfokus pada kenyamanan dan ke-khusukan
              dalam ibadah Anda.
            </p>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Berbeda dengan travel Umrah massal, kami memastikan kelompok kecil, pembimbing
              eksklusif, dan layanan personal untuk setiap jamaah.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Shield className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold">Exclusive & Flexibel</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    Fokus beribadah dengan orang tersayang dengan program yang sesuai dengan
                    keinginan Anda.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Lock className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold">Amanah & Terpercaya</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    Tim yang berpengalaman yang berfokus mendampingin ibadah Umrah Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
