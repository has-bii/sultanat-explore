import { trustBadges } from "../data"

export function WhyUs() {
  return (
    <section className="border-y bg-card py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Kenapa Kami
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Partner perjalanan terpercaya & berpengalaman
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center rounded-2xl border bg-background p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-3xl">{badge.icon}</span>
              <h3 className="mt-3 font-heading text-base font-semibold">{badge.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
