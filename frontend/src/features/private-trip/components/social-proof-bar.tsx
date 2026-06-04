import { trustStats } from "../data"

export function SocialProofBar() {
  return (
    <section className="bg-card border-y">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="divide-border grid grid-cols-2 divide-x sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 py-8">
              <span className="font-heading text-primary text-3xl font-bold lg:text-4xl">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
