import { whyTurkeyItems } from "../data"

export function WhyTurkey() {
  return (
    <section className="bg-card border-y py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Kenapa Turki?
          </span>
          <h2 className="font-heading text-subheading md:text-heading mt-2 font-bold tracking-tight">
            Alasan Traveler Indonesia Memilih Turki
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyTurkeyItems.map((item) => (
            <div
              key={item.title}
              className="bg-background hover:shadow-uber-sm rounded-xl border p-6 transition-shadow"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-heading mt-4 text-base font-bold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
