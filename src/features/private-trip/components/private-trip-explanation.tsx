import { Lock, Shield } from "lucide-react"

export function PrivateTripExplanation() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop"
                alt="Private trip Turkey"
                className="h-[400px] w-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating stat */}
            <div className="absolute -right-3 top-8 rounded-2xl border bg-background/90 px-4 py-3 shadow-uber-md backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-[11px] text-muted-foreground">Customizable</p>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Kenalan dulu
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Apa itu
              <br />
              <span className="text-primary">Private Trip?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Private trip pilihan liburan bareng teman atau keluarga tanpa campur dengan rombongan
              lain. Bebas atur jadwal, itinerary dan yang pasti liburan Anda lebih asik dengan
              orang-orang tersayang.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold">Eksklusif & Fleksibel</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    Hanya Anda dan orang-orang pilihan Anda. Tanpa campurt dengan orang lain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold">Aman & Terpercaya</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    Tim berpengalaman, dan telah melayani ratusan traveler dari Indonesia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
