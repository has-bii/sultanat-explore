import { MessageCircle, PlaneTakeoff, Search } from "lucide-react"
import { howItWorks } from "../data"

const iconMap = [Search, MessageCircle, PlaneTakeoff]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Cara Booking
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            3 Langkah, Langsung Berangkat
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute top-10 left-0 right-0 hidden lg:block">
            <div className="mx-auto max-w-3xl border-t-2 border-dashed border-primary/15" />
          </div>

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {howItWorks.map((item, i) => {
              const Icon = iconMap[i]
              return (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Icon className="h-8 w-8" />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background text-xs font-bold text-primary ring-2 ring-primary/30">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
