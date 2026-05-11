import { Clock, Compass, BookOpen } from "lucide-react"
import { advisorProfile, WHATSAPP_BASE } from "../data"

export function TravelAdvisor() {
  const waText = encodeURIComponent(
    "Halo SultanatExplore, saya ingin konsultasi mengenai paket Umrah. Mohon info lebih lanjut."
  )

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pembimbing Kami
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Ditemani yang Berpengalaman
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-background shadow-uber-sm">
          <div className="grid items-center lg:grid-cols-5">
            {/* Photo */}
            <div className="relative h-64 overflow-hidden lg:col-span-2 lg:h-full">
              <img
                src={advisorProfile.photo}
                alt={advisorProfile.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-6 lg:col-span-3 lg:p-8">
              <h3 className="font-heading text-xl font-bold">
                {advisorProfile.name}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-primary">
                {advisorProfile.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {advisorProfile.bio}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pengalaman</p>
                    <p className="text-sm font-semibold">
                      {advisorProfile.experience}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spesialisasi</p>
                    <p className="text-sm font-semibold">
                      {advisorProfile.speciality}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
