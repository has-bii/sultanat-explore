# PRD-02: High-Impact SEO — Canonical/Params, OG Cards, Content, Internal Links

> **Status:** Draft · **Priority:** P1 High · **Effort:** M (1 day)
> **Depends on:** PRD-01 (sitemap + structured-data patterns established)
> **Blocks:** none

## Goal

Four high-impact improvements for `/destinations` ranking and CTR:
1. Explicit canonical + `noindex` strategy for `?category`/`?search` param URLs
2. OpenGraph + Twitter cards (root defaults + page overrides)
3. ~300-word intro content block (long-tail keyword capture)
4. Internal links to trip-package pages (money-page interlinking)

## Context

Audited 2026-06-24. Current gaps:

- `CitiesGridSection` uses `nuqs` to mutate `?category=` / `?search=` in the URL. No canonical stripping, no `noindex` for param variants → duplicate-content / crawl-budget risk.
- No `openGraph` or `twitter` metadata anywhere (`layout.tsx`, `page.tsx`).
- Page body is H1 + 1 hero paragraph → grid. Competitor travel hubs rank with 800+ words; Indonesian long-tail ("wisata turki untuk indonesian") untapped.
- Page links only to city detail pages and WhatsApp CTA. Trip-package pages (open trip, private trip, umrah) are the actual conversion paths but receive zero internal-link equity from the hub.

Project conventions: Bahasa Indonesia content, IDR, WhatsApp CTA. Tech: Next.js 16 App Router, React 19, shadcn/ui (radix-vega).

## Scope

**In scope:**
- `frontend/src/app/(public)/destinations/page.tsx` (add `generateMetadata`, OG, canonical, intro section)
- New `IntroSection` component under `@/features/destinations`
- Trip-package listing section linking to existing trip pages
- Root layout OG defaults

**Out of scope:**
- Root Organization/WebSite schema (→ PRD-04)
- Keyword mapping doc (→ PRD-04)
- Breadcrumb visual UI (→ PRD-03 Quick Wins)

## Tasks

### T1. Explicit canonical + noindex for param URLs
Convert static `metadata` → async `generateMetadata` in the page so it can read `searchParams`.

```ts
import type { Metadata, ResolvingMetadata } from "next"

type Props = {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { category, search } = await destinationSearchParamsCache.parse(searchParams)
  const hasFilters = Boolean(category) || Boolean(search)

  return {
    title: "Destinasi Wisata Turki",
    description: "Jelajahi destinasi wisata Turki terbaik: Istanbul, Cappadocia, Pamukkale, Antalya, Trabzon, dan lainnya. Temukan perjalanan impian Anda.",
    alternates: { canonical: "/destinations" },
    robots: hasFilters
      ? { index: false, follow: true }   // param variants: not indexed, links still followed
      : { index: true, follow: true },
  }
}
```

**Why this is correct (per seo-audit skill):**
- Self-referencing canonical on the bare URL → authoritative version.
- `noindex` on filtered variants prevents duplicate content without wasting crawl budget (Google explicitly recommends `noindex` over canonical for faceted nav when variants aren't link-equity targets).
- `follow: true` everywhere so city-card links remain dereferenced.

**Complement:** add to `frontend/src/app/robots.ts`:
```ts
disallow: ["/admin", "/api", "/destinations?category", "/destinations?search"]
```
This stops the param versions from being prioritized for crawl.

### T2. OpenGraph + Twitter cards
**Root layout** (`frontend/src/app/layout.tsx`) — site-wide OG defaults:
```ts
openGraph: {
  type: "website",
  locale: "id_ID",
  url: siteUrl,
  siteName: "SultanatExplore",
  images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "SultanatExplore" }],
},
twitter: { card: "summary_large_image", site: "@sultanatexplore" },
```
Place the OG image at `frontend/public/og/destinations.png` (1200×630).
Reuse `metadata.title` template — do not redefine `siteName` on pages.

> **Note:** ARK.md claims Next.js 16 OG auto-generation support. Verify before assuming; if not available, ship static images.

Assume `NOT_ALLOWED` list at root. Per-page retry adds duplicate config noise. Keep one canonical here.

### T3. Intro content block (~300 words, ID)
Create `frontend/src/features/destinations/components/intro-section.tsx`:

- H2: "Tentang Wisata Turki" (or "Mengapa Turki Destinasi Favorit Indonesian")
- 200–400 words of original ID copy covering: brief overview, top regions, best travel season for Indonesian travelers, visa/Umrah angle, why SultanatExplore.
- Target long-tail naturally: "wisata turki untuk indonesian", "tempat wisata di turki terpopuler", "paket tour turki".
- One contextual internal link cluster. HTML stays semantic — no markdown duplication.
- Place between `HeroSection` and `FeaturedCities` (matches "overview → popular → all" intent).

**Content quality guard (per seo-audit / AI-writing-detection reference):**
- Avoid AI-ish patterns: em dash overuse, "Nestled", "Discover", "vibrant", "tapestry", filler.
- First-hand-experience framing: real city names, IDR price references, Indonesian traveler pain points (halal food, language, distance).
- Don't repost generic travel-blog paragraphs — must read as agency-voice.

Place before `HeroSection` is also acceptable but `Hero → Intro → Featured` flows better. Decide with PM if conflict.

### T4. Internal links to trip packages
Add a `RelatedTrips`-style section linking to existing trip listing pages.

- Locate trip routes first: `frontend/src/app/(public)/` likely has `/trips` or `/open-trip` / `/private-trip` / `/umrah`. **Confirm paths before writing links.**
- If trip pages don't exist yet, link to WhatsApp CTA preset with `?text=...` prefilled → still passes equity to conversion.
- Insert a "Paket Trip ke Turki" section (H2) between `CitiesGridSection` and `FeaturedDestinations`.
- 3–6 cards, each linking to a real internal route (not external WhatsApp except fallback).

**Acceptance:** every card `href` resolves to 200. No orphan links.

## Acceptance Criteria

- [ ] `curl /destinations` HTML contains `<link rel="canonical" href="https://sultanatexplore.com/destinations">` (bare URL, no query).
- [ ] Visiting `/destinations?category=budaya` returns `<meta name="robots" content="noindex,follow">`.
- [ ] Root layout emits `og:site_name`, `og:type`, `og:locale`, `og:image`, `twitter:card`.
- [ ] `/destinations` emits `og:title`, `og:description`, `og:image` (unique image), `og:url` = canonical.
- [ ] Intro section renders ~300 words of ID prose with H2 "Tentang Wisata Turki" (or approved alt) before grid.
- [ ] Trip-package section links to ≥3 live internal routes (HTTP 200 on local `pnpm dev`).
- [ ] `pnpm build` passes; no hydration warnings.
- [ ] No new React `<a>` without `rel` / on-page penalty (internal links safe).

## Verification

```bash
cd frontend
pnpm typecheck && pnpm build
pnpm dev
# In another shell:
curl -s localhost:3000/destinations | grep -E "canonical|og:|twitter:|robots"
curl -s "localhost:3000/destinations?category=buah" | grep -E "noindex|robots"
```

Share preview via [Meta Debugger](https://developers.facebook.com/tools/debug/) + [Twitter Card Validator] before shiip confidence). Also [PageSearch-Insights](https://pagespeed.web.dev/) on `/destinations` for LCP/CLS delta intro-section introduces (must keep LCP < 2.5s, CLS < 0.1).

## Risks & Notes

- **Intro section images:** Avoid — keeps LCP stable. If image used, lazy-load + sizing.
- **`generateMetadata` async:** React 19 supports `await` on searchParams in metadata. Already patterned on precompiled `DestinationSearchParamsCache`? Verify `nuqs/server` ships then proceed.
- **Trip route discovery:** If trips live elsewhere (e.g. `/paket/...`), update links. Don't invent routes.
- **OG image auto-gen:** Next.js 16 may offer `opengraph-image.tsx`. Prefer PNG for now — faster, build-tested. Optimize in PRD-04.
- **Localize:** Always `locale: "id_ID"` in OG (Indonesian audience). No hreflang (single-locale project — no PRD-02 work needed).

## Files Touched

- `frontend/src/app/(public)/destinations/page.tsx` (generateMetadata, OG override, intro placement)
- `frontend/src/app/layout.tsx` (OG defaults)
- `frontend/src/app/robots.ts` (disallow param URLs)
- `frontend/src/features/destinations/components/intro-section.tsx` (new)
- `frontend/src/features/destinations/index.ts` (export)
- `frontend/public/og/destinations.png` (new asset, design-supplied)
- `frontend/src/components/trip-links-section.tsx` (new — or reuse if `RelatedTrips` fits)