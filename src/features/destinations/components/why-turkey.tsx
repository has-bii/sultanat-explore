import { whyTurkeyItems } from "../data"

export function WhyTurkey() {
  return (
    <section className="border-y bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 lg:mb-16 text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Kenapa Turki?
          </span>
          <h2 className="mt-2 font-heading text-subheading font-bold tracking-tight md:text-heading">
            Alasan Traveler Indonesia Memilih Turki
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyTurkeyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-background p-6 transition-shadow hover:shadow-uber-sm"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-heading text-base font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
