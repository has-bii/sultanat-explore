import { MessageCircle, PlaneTakeoff, Search } from "lucide-react"

import { howItWorks } from "../data"

const iconMap = [Search, MessageCircle, PlaneTakeoff]

export function HowItWorks() {
  return (
    <section className="border-y py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Cara Booking
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            3 Langkah, Langsung Berangkat
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Connecting line */}
          <div className="absolute top-10 right-0 left-0 hidden lg:block">
            <div className="border-primary/15 mx-auto max-w-3xl border-t-2 border-dashed" />
          </div>

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {howItWorks.map((item, i) => {
              const Icon = iconMap[i]
              return (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="bg-primary text-primary-foreground shadow-primary/20 relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg">
                    <Icon className="h-8 w-8" />
                    <span className="bg-background text-primary ring-primary/30 absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-2">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-heading mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
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
