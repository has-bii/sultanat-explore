import { GetCityResponse } from "@/features/city/queries"

interface Props {
  data: GetCityResponse["data"]
}

export function AboutSection({ data }: Props) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Description — wider */}
          <div className="lg:col-span-3">
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Tentang {data.name}
            </span>
            <p className="text-foreground/90 mt-4 text-lg leading-relaxed">{data.description}</p>
          </div>

          {/* Highlights — sidebar */}
          <div className="lg:col-span-2">
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Highlights
            </span>
            <ul className="mt-4 space-y-3">
              {data.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-foreground text-sm font-medium">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
