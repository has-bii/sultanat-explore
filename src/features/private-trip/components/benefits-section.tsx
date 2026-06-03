import { benefits } from "../data"

export function BenefitsSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Keunggulan
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Kenapa Pilih Private Trip?
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border bg-background p-6 transition-all hover:-translate-y-0.5 hover:shadow-uber-md"
            >
              <span className="text-3xl">{b.icon}</span>
              <h3 className="mt-3 font-heading text-base font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
