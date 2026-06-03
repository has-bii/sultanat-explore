export function AboutHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {/* Full-bleed background */}
      <img
        src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&h=1080&fit=crop&q=80"
        alt="Istanbul skyline at sunset"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="font-medium">Tentang Kami</span>
        </div>

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Cerita di Balik
          <br />
          <span className="text-white/80">SultanatExplore</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          Dari mahasiswa Indonesia di Istanbul menjadi travel agent terpercaya untuk ratusan
          traveler. Kami beroperasi langsung dari Turki — untuk pengalaman yang autentik dan
          personal.
        </p>
      </div>

      {/* Sentinel for navbar color inversion — spans full hero */}
      <div data-nav-theme="dark" className="absolute inset-0" aria-hidden />
    </section>
  )
}
