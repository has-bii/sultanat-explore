import { PenLine } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-muted relative overflow-hidden py-20 lg:py-28">
      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-50">
        <div className="bg-primary/5 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/8 absolute right-20 bottom-10 h-48 w-48 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
        <div className="bg-background/80 mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
          <PenLine className="text-primary h-4 w-4" />
          <span className="font-medium">Blog & Tips</span>
        </div>

        <h1 className="font-heading mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Artikel & Tips
          <br />
          <span className="text-primary">Perjalanan</span>
        </h1>

        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Temukan panduan perjalanan, tips praktis, dan inspirasi untuk petualangan Anda ke Turki
          dan Tanah Suci.
        </p>
      </div>
    </section>
  )
}
