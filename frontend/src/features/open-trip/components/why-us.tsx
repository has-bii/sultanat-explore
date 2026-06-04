import { trustBadges } from "../data"

export function WhyUs() {
  return (
    <section className="bg-card border-y py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Kenapa Kami
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Partner perjalanan terpercaya & berpengalaman
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="bg-background flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-3xl">{badge.icon}</span>
              <h3 className="font-heading mt-3 text-base font-semibold">{badge.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
