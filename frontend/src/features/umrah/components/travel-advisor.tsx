import { BookOpen, Clock, Compass } from "lucide-react"

import Image from "next/image"

import { WHATSAPP_BASE, advisorProfile } from "../data"

export function TravelAdvisor() {
  const waText = encodeURIComponent(
    "Halo SultanatExplore, saya ingin konsultasi mengenai paket Umrah. Mohon info lebih lanjut.",
  )

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Pembimbing Kami
          </span>
          <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight">
            Ditemani yang Berpengalaman
          </h2>
        </div>

        <div className="bg-background shadow-uber-sm mt-10 overflow-hidden rounded-2xl border">
          <div className="grid items-center lg:grid-cols-5">
            {/* Photo */}
            <div className="relative h-64 overflow-hidden lg:col-span-2 lg:h-full">
              <Image
                fill
                src={advisorProfile.photo}
                alt={advisorProfile.name}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-6 lg:col-span-3 lg:p-8">
              <h3 className="font-heading text-xl font-bold">{advisorProfile.name}</h3>
              <p className="text-primary mt-0.5 text-sm font-medium">{advisorProfile.role}</p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {advisorProfile.bio}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    <Clock className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Pengalaman</p>
                    <p className="text-sm font-semibold">{advisorProfile.experience}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    <BookOpen className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Spesialisasi</p>
                    <p className="text-sm font-semibold">{advisorProfile.speciality}</p>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                <Compass className="h-4 w-4" />
                Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
