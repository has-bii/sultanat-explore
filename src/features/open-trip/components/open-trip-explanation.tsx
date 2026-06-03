import Image from "next/image"

const benefits = [
  {
    title: "Harga Terjangkau",
    description:
      "Biaya perjalanan dibagi bersama peserta lain, jadi lebih hemat dibanding private trip.",
  },
  {
    title: "Jadwal Pasti",
    description:
      "Tanggal keberangkatan sudah ditentukan, tinggal pilih yang sesuai dengan waktu Anda.",
  },
  {
    title: "Teman Traveling Baru",
    description: "Kesempatan seru untuk menjelajahi Turkiye sambil memperluas pertemanan",
  },
  {
    title: "Fasilitas All-Inclusive",
    description:
      "Tiket pesawat, hotel, transport, meals, dan tour guide sudah termasuk dalam harga.",
  },
]

export function OpenTripExplanationA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Photo */}
          <div className="relative">
            <div className="relative aspect-3/4 overflow-hidden rounded-3xl">
              <Image
                fill
                src="https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop"
                alt="Cappadocia balloons"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  ✦ Cappadocia, Turki
                </span>
              </div>
            </div>
            {/* Decorative accent — rotated rectangle behind */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl border-2 border-primary/20" />
            {/* Floating stat */}
            <div className="absolute -right-3 top-8 rounded-2xl border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-[11px] text-muted-foreground">Traveler puas</p>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Kenalan dulu
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-primary">Open Trip</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Perjalanan wisata grup dengan jadwal dan rute sudah ditentukan. Anda bergabung bersama
              traveler lain, dipandu tour guide berpengalaman. Tinggal pilih trip yang tersedia.
            </p>

            {/* Benefits list */}
            <div className="mt-10 space-y-6">
              {benefits.map((b, i) => {
                return (
                  <div key={b.title} className="flex gap-5">
                    <div className="shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold">{b.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {b.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
