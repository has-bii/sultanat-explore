import { benefits } from "../data"

export function BenefitsSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Keunggulan
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Kenapa Pilih Private Trip?
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-background hover:shadow-uber-md rounded-2xl border p-6 transition-all hover:-translate-y-0.5"
            >
              <span className="text-3xl">{b.icon}</span>
              <h3 className="font-heading mt-3 text-base font-semibold">{b.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
