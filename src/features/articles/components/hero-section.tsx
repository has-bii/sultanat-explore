import { BookOpen, PenLine } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-muted py-20 lg:py-28">
      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
          <PenLine className="h-4 w-4 text-primary" />
          <span className="font-medium">Blog & Tips</span>
        </div>

        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Artikel & Tips
          <br />
          <span className="text-primary">Perjalanan</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Temukan panduan perjalanan, tips praktis, dan inspirasi untuk petualangan Anda ke Turki
          dan Tanah Suci.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />6 Artikel
          </span>
          <span className="flex items-center gap-1.5">
            <PenLine className="h-4 w-4 text-primary" />6 Kategori
          </span>
        </div>
      </div>
    </section>
  )
}
