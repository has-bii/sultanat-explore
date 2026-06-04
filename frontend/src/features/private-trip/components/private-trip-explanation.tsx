import { Lock, Shield } from "lucide-react"

import Image from "next/image"

export function PrivateTripExplanation() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop"
                alt="Private trip Turkey"
                width={800}
                height={600}
                className="h-[400px] w-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating stat */}
            <div className="bg-background/90 shadow-uber-md absolute top-8 -right-3 rounded-2xl border px-4 py-3 backdrop-blur-sm">
              <p className="text-primary text-2xl font-bold">100%</p>
              <p className="text-muted-foreground text-[11px]">Customizable</p>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              Kenalan dulu
            </span>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Apa itu
              <br />
              <span className="text-primary">Private Trip?</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Private trip pilihan liburan bareng teman atau keluarga tanpa campur dengan rombongan
              lain. Bebas atur jadwal, itinerary dan yang pasti liburan Anda lebih asik dengan
              orang-orang tersayang.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Lock className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold">Eksklusif & Fleksibel</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    Hanya Anda dan orang-orang pilihan Anda. Tanpa campur dengan orang lain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Shield className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold">Aman & Terpercaya</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
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
