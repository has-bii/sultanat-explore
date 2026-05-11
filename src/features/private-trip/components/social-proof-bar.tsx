import { trustStats } from "../data"

export function SocialProofBar() {
  return (
    <section className="border-y bg-card">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 py-8"
            >
              <span className="font-heading text-3xl font-bold text-primary lg:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
