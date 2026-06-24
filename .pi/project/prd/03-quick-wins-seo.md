# PRD-03: Quick Wins — Heading Fix, Description CTA, Breadcrumb UI

> **Status:** Draft · **Priority:** P2 Quick · **Effort:** S (~45min)
> **Depends on:** none (independent, can run alongside PRD-01/02)
> **Blocks:** none

## Goal

Three small, independent, low-risk polish fixes from the SEO audit:
1. Fix skipped heading level in `CityCard` (H2 → H4 → restore H3)
2. Strengthen meta description with a CTA
3. Add visual breadcrumb (Home › Destinations) matching `BreadcrumbList` from PRD-01

## Context

Audited 2026-06-24.

- `frontend/src/features/city/public/components/cities-grid/card.tsx` (CityCard) uses `<h4>` for city name while section parents are H2 — skips H3. Same to verify in any destination card component.
- Meta description is 140 chars, present but CTA-less. Adding a CTA intent ("Lihat paket & harga") improves CTR per seo-audit on-page guidance.
- No visual breadcrumb UI on `/destinations`, even though `BreadcrumbList` JSON-LD lands in PRD-01. UI gives users path affordance + matches structured data.

Project conventions: Bahasa Indonesia, shadcn/ui (radix-vega), `@/components/ui/*` pattern.

## Scope

**In scope:**
- `frontend/src/features/city/public/components/cities-grid/card.tsx`
- `frontend/src/app/(public)/destinations/page.tsx` (description tweak in metadata)
- New breadcrumb component + placement

**Out of scope:**
- Structured data (PRD-01)
- Canonical/OG (PRD-02)
- Canonical JSON-LD (PRD-01)

## Tasks

### T1. CityCard h4 → h3
Edit `frontend/src/features/city/public/components/cities-grid/card.tsx`:

```diff
-        <h4 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
+        <h3 className="font-heading group-hover:text-primary text-base font-bold transition-colors">
           {data.name}
-        </h4>
+        </h3>
```

**Also check:** `frontend/src/features/destination/public/components/featured-destinations/grid.tsx` — likely uses `<h4>` too. Audit all `<h4>` in destination/city card components and demote to `<h3>` if the section parent is `<h2>`. If a card legitimately nests under an `<h3>` parent (rare), keep `<h4>`.

Run this to find candidates before editing:
```bash
rg -n "<h[4-6]" frontend/src/features/city frontend/src/features/destination
```

### T2. Description CTA
Edit `frontend/src/app/(public)/destinations/page.tsx` metadata:

```ts
description:
  "Jelajahi destinasi wisata Turki terbaik — Istanbul, Cappadocia, Pamukkale, Antalya, dan Trabzon. Lihat paket trip & harga IDR, hubungi via WhatsApp.",
```

Length ~155 chars (within 150–160 sweet spot). Adds CTA intent + clarifies Indonesian-locale signal (IDR, WhatsApp).

> If PRD-02 lands first and converts to `generateMetadata`, apply the same description string there. Keep one source of truth.

### T3. Breadcrumb UI
Verify a `Breadcrumb` shadcn primitive exists:
```bash
ls frontend/src/components/ui/breadcrumb.tsx
```
If missing:
```bash
cd frontend && pnpm dlx shadcn@latest add breadcrumb -c frontend
```

Create or reuse a small wrapper. Options:

**Option A — lightweight inline in page.tsx:** (preferred for now)
```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"

// inside DestinasiPage return, before <HeroSection />:
<Breadcrumb className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild><Link href="/">Beranda</Link></BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Destinasi</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

**Option B — componentize:** Create `frontend/src/components/breadcrumbs.tsx` accepting a `items: { label, href? }[]` prop for reuse on city detail pages later (recommended if detail-page breadcrumb PRD is anticipated).

Pick B if more than one page will use breadcrumbs; otherwise A. Either way label matches `BreadcrumbList` JSON-LD labels from PRD-01 ("Beranda" / "Destinasi").

> **PRD-01 dependency note:** UI breadcrumb can land before PRD-01's `BreadcrumbList` JSON-LD — visual and structured data are independent. But labels must agree once both exist. Coordinate wording with PRD-01.

## Acceptance Criteria

- [ ] No `<h4>` remains in any city/destination card whose section parent is `<h2>` (verified via `rg -n "<h4" frontend/src/features/{city,destination}` — review each remaining occurrence).
- [ ] meta description length 145–160 chars, contains "WhatsApp" + "IDR", present tense CTA.
- [ ] `/destinations` renders breadcrumb UI (visible on desktop + mobile; responsive — wraps if needed).
- [ ] Breadcrumb links: "Beranda" → `/` (200), "Destinasi" is current page (no link / `BreadcrumbPage`).
- [ ] `pnpm build` + `pnpm lint` pass.
- [ ] Mobile layout: breadcrumb does not cause horizontal scroll (test at 375px width).

## Verification

```bash
cd frontend
rg -n "<h4" src/features/city src/features/destination   # confirm cleared / justified
pnpm typecheck && pnpm build
pnpm dev
# visit /destinations → confirm breadcrumb visible, CityCard headings probe via DevTools (h3)
```

Accessibility quick check: breadcrumb `aria-label="breadcrumb"` (the shadcn primitive includes by default — verify).

## Risks & Notes

- React Compiler (enabled project-wide) — no functional concern; JSX changes compile cleanly.
- Shadcn breadcrumb primitive may not exist yet — first run `ls` then `pnpm dlx shadcn add`. Don't assume.
- Em-dash in description ("— Istanbul") — only one em dash; seo-audit AI-writing ref flags *overuse*, not presence. One is fine for readability.
- Don't restyle `CityCard` beyond the tag change — visual identity unchanged. Touching only the semantic tag.

## Files Touched

- `frontend/src/features/city/public/components/cities-grid/card.tsx`
- `frontend/src/features/destination/public/components/featured-destinations/grid.tsx` (likely)
- `frontend/src/app/(public)/destinations/page.tsx` (description + breadcrumb insert)
- `frontend/src/components/ui/breadcrumb.tsx` (add if missing)
- `frontend/src/components/breadcrumbs.tsx` (new, only if Option B chosen)