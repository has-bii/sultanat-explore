# PRD-01: Critical SEO Fixes — `/destinations` Page

> **Status:** Draft · **Priority:** P0 Critical · **Effort:** S (1–2h)
> **Depends on:** none · **Blocks:** PRD-02 (canonical strategy), PRD-04 (keyword mapping)

## Goal

Fix 3 critical SEO defects on the `/destinations` hub page that block ranking and rich-result eligibility:
1. Title template double-brand collision
2. Page (and city detail pages) missing from XML sitemap
3. No structured data on the hub page

## Context

The `/destinations` page is the hub linking to all city detail pages (`/destinations/{slug}`), which are the money pages driving WhatsApp leads. Current state (audited 2026-06-24):

- Root layout (`frontend/src/app/layout.tsx`) sets `metadata.title.template: "%s | SultanatExplore"`.
- Page (`frontend/src/app/(public)/destinations/page.tsx`) sets `title: "Destinasi Wisata Turki — SultanatExplore"` → renders `Destinasi Wisata Turki — SultanatExplore | SultanatExplore` (brand twice, ~58 chars).
- `frontend/src/app/sitemap.ts` emits only `/` and `/artikel*` — `/destinations` and `/destinations/{slug}` rely on crawl discovery.
- No JSON-LD anywhere on app. Page is a collection of destinations → eligible for `ItemList` + `BreadcrumbList`.

Project conventions (see `AGENTS.md`): Bahasa Indonesia content, IDR currency, WhatsApp CTA. Tech: Next.js 16 App Router, React 19, React Compiler, shadcn/ui (radix-vega).

## Scope

**In scope:**
- `frontend/src/app/(public)/destinations/page.tsx`
- `frontend/src/app/sitemap.ts`
- New code path to fetch all cities for sitemap + JSON-LD
- New structured-data helper module

**Out of scope:**
- OG/Twitter cards (→ PRD-02)
- Canonical/noindex for param URLs (→ PRD-02)
- Root layout Organization/WebSite schema (→ PRD-04)
- Content body rewrite (→ PRD-02)

## Tasks

### T1. Fix title template collision
Edit `frontend/src/app/(public)/destinations/page.tsx`:

```ts
export const metadata: Metadata = {
  title: "Destinasi Wisata Turki",       // template auto-appends "| SultanatExplore"
  description:
    "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
}
```

Result SERP title: `Destinasi Wisata Turki | SultanatExplore` (~39 chars, keyword front-loaded).

### T2. Add destinations to XML sitemap
Edit `frontend/src/app/sitemap.ts`:

- Add hub entry: `{ url: \`${siteUrl}/destinations\`, lastModified: new Date(), priority: 0.9 }`
- Fetch all published cities (existing getter candidate: `fetchAllCities` or pattern from `@/features/city/public/lib/fetch` — verify before use; create one if absent).
- Map each to:
  ```ts
  { url: `${siteUrl}/destinations/${city.slug}`, lastModified: parseISO(city.updatedAt), priority: 0.8 }
  ```
- Insert before `...articleEntries`.

**Verify the fetch function exists.** Run a search in `frontend/src/features/city/public/lib/`. If only `fetchFeaturedCities`/`fetchCityCategories` exist, add a `fetchAllCitySlugs()` (or reuse `getCitiesQueryOptions` server-side with `limit: high`). Keep sitemap fetch lean — return only `slug` + `updatedAt`.

### T3. Add ItemList + BreadcrumbList JSON-LD
Create `frontend/src/features/destinations/lib/structured-data.ts` exporting helpers:

```ts
export function destinationsBreadcrumbJsonLd(): object
export function citiesItemListJsonLd(cities: { slug: string; name: string; image: string }[]): object
```

**BreadcrumbList** (Home › Destinations):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "${siteUrl}/" },
    { "@type": "ListItem", "position": 2, "name": "Destinasi", "item": "${siteUrl}/destinations" }
  ]
}
```

**ItemList** (all cities on the page): one `ListItem` per city with `url`, `name`, `image`. Use the same data source as T2 (fetch once, reuse).

Render via a server component:

```tsx
import { destinationsBreadcrumbJsonLd, citiesItemListJsonLd } from "@/features/destinations/lib/structured-data"

export default async function DestinasiPage({ searchParams }: Props) {
  const cities = await fetchAllCitySlugs()  // reuse fetch from T2
  const breadcrumbLd = destinationsBreadcrumbJsonLd()
  const itemListLd = citiesItemListJsonLd(cities)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <HeroSection />
      {/* ...existing sections... */}
    </>
  )
}
```

> Keep `<script>` tags inside the React tree (no hydration mismatch risk — they're static SSR HTML).

**Validate** with Google Rich Results Test after deploy (per seo-audit skill: `curl`/`web_fetch` strip `<script>` tags → must use browser/Rich Results Test to confirm schema).

## Acceptance Criteria

- [ ] SERP title for `/destinations` reads `Destinasi Wisata Turki | SultanatExplore` (single brand).
- [ ] `curl /sitemap.xml` contains `<loc>https://sultanatexplore.com/destinations</loc>` and one `<loc>` per city detail page.
- [ ] `npm run build` / `pnpm build` passes; no TypeScript regressions.
- [ ] Rich Results Test on `/destinations` shows valid `BreadcrumbList` + `ItemList` (zero errors).
- [ ] No runtime/perf regression: page still streams (Suspense preserved around existing sections; JSON-LD fetch is non-blocking — wrap in its own `Suspense` if slow).

## Verification

```bash
cd frontend
pnpm typecheck
pnpm build
# local: pnpm dev → visit http://localhost:3000/destinations, view-source, confirm 2 JSON-LD scripts
```

## Risks & Notes

- `metadataBase` fallback (`https://sultanatexplore.com`) is already set when `NEXT_PUBLIC_SITE_URL` missing — safe for OG/canonical later.
- Do NOT add `noindex` here; param URL strategy is PRD-02.
- React Compiler: `dangerouslySetInnerHTML` for JSON-LD is fine (compiler skips it).
- If city count is large (>1000), paginate `ItemList` later — out of scope now.

## Files Touched

- `frontend/src/app/(public)/destinations/page.tsx`
- `frontend/src/app/sitemap.ts`
- `frontend/src/features/destinations/lib/structured-data.ts` (new)
- `frontend/src/features/city/public/lib/fetch.ts` (maybe new fetcher — confirm needed)