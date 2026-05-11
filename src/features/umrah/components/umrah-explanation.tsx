import { Lock, MapPin, Shield } from "lucide-react"

export function UmrahExplanation() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1592326871020-04f58c1a52f3?w=800&h=600&fit=crop"
                alt="Masjidil Haram"
                className="h-80 w-full object-cover lg:h-105"
                loading="lazy"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -right-4 rounded-2xl border bg-background p-4 shadow-uber-md sm:-bottom-6 sm:-right-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Makkah & Madinah</p>
                  <p className="text-xs text-muted-foreground">Hotel dekat Masjid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Private Umrah
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              Ibadah Tenang, Semua Kami Atur
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Umrah adalah perjalanan spiritual yang sakral. Kami memahami bahwa setiap jamaah ingin
              fokus pada ibadah tanpa khawatir logistik. Itulah mengapa SultanatExplore menyediakan
              paket Umrah privat — dari akomodasi hingga bimbingan ibadah, semua kami tangani.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Berbeda dengan travel Umrah massal, kami memastikan kelompok kecil, pembimbing
              eksklusif, dan layanan personal untuk setiap jamaah.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold">Halal & Muslim-Friendly</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    Makanan halal 100%, jadwal shalat diutamakan, dan pembimbing ibadah
                    bersertifikat.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold">Aman & Terpercaya</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    Berpengalaman melayani ratusan jamaah Indonesia. Rekening resmi PT, transparansi
                    penuh.
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
