import { Quote } from "lucide-react"

import { testimonials } from "../data"

export function TestimonialsSection() {
  return (
    <section className="bg-card border-y py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Testimoni
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Kata Mereka tentang Private Trip
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-background shadow-uber-sm rounded-2xl border p-6">
              <Quote className="text-primary/20 h-5 w-5" />
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {t.location} · {t.trip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
