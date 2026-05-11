import {
  ArrowRight,
  BookOpen,
  Building2,
  Compass,
  FileCheck,
  Car,
  Utensils,
  Package,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { umrahService } from "../data";
import type { Facility } from "../data";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  building: Building2,
  compass: Compass,
  "file-check": FileCheck,
  car: Car,
  utensils: Utensils,
  package: Package,
  "shield-check": ShieldCheck,
};

function FacilityCard({ facility }: { facility: Facility }) {
  const Icon = iconMap[facility.icon];

  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/8">
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/80">
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold leading-tight text-white">
            {facility.title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            {facility.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function UmrahSection() {
  const { facilities } = umrahService;

  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z' fill='none' stroke='white' stroke-width='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Text */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Private Umrah
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Perjalanan Spiritual yang Berkesan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            {umrahService.description}
          </p>
        </div>

        {/* Facility grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facilities.map((facility) => (
            <FacilityCard key={facility.title} facility={facility} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href={umrahService.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
          >
            {umrahService.ctaText}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
