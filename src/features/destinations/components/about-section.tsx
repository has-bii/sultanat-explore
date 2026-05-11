import type { Destination } from "../types"

export function AboutSection({ destination }: { destination: Destination }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Description — wider */}
          <div className="lg:col-span-3">
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Tentang {destination.name}
            </span>
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">
              {destination.description}
            </p>
          </div>

          {/* Highlights — sidebar */}
          <div className="lg:col-span-2">
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Highlights
            </span>
            <ul className="mt-4 space-y-3">
              {destination.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
