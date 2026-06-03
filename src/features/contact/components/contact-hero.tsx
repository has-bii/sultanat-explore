import Image from "next/image"

export function ContactHero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      {/* Full-bleed background */}
      <Image
        fill
        src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=1920&h=1080&fit=crop&q=80"
        alt="Istanbul Bosphorus bridge at dusk"
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="font-medium">Hubungi Kami</span>
        </div>

        <h1 className="font-heading mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Kami Siap
          <br />
          <span className="text-white/80">Membantu Anda</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          Punya pertanyaan tentang trip, butuh bantuan custom itinerary, atau ingin berkolaborasi?
          Tim SultanatExplore siap merespons dengan cepat.
        </p>
      </div>

      {/* Sentinel for navbar color inversion */}
      <div data-nav-theme="dark" className="absolute inset-0" aria-hidden />
    </section>
  )
}
