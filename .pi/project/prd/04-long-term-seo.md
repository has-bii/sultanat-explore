# PRD-04: Long-Term SEO — Root Schema, Keyword Mapping, OG Automation, GSC

> **Status:** Draft · **Priority:** P3 Long-term · **Effort:** L (2–3 days, ongoing)
> **Depends on:** PRD-01 (structured-data patterns), PRD-02 (OG defaults established)
> **Blocks:** none

## Goal

Foundational, site-wide SEO infrastructure that compounds over time and prevents future regressions:
1. Root `Organization` + `WebSite` (with `SearchAction`) schema
2. Keyword mapping doc — prevent cannibalization, plan topical clusters
3. Replace static OG images with Next.js 16 dynamic `opengraph-image` generation
4. Google Search Console workflow: ownership verification + sitemap submission + monitoring

## Context

After PRD-01/02/03 land, `/destinations` is technically clean and on-page optimized. But four gaps remain that block structured brand-entity association, scale, and measurable feedback loops:

- App has zero site-level structured data. No `Organization` (LocalBusiness subclass — travel agency) means no brand-entity, no logo in Knowledge Panel, no `WebSite` `SearchAction` for sitelinks search box.
- No keyword mapping document → as new pages (city detail, trip types, blog) get built, cannibalization risk grows silently. The hub `/destinations` and city detail `/destinations/{slug}` could target overlapping queries ("wisata istanbul" hub vs detail).
- OG images are static PNGs (PRD-02 ships a destinations one). Dynamic per-page OG (title + hero image) scales better and keeps design consistent without manual asset work per page.
- No confirmed Search Console integration → can't measure ranking, detect indexation drops, validate rich results, or catch hreflang/sitemap errors before they harm.

Tech: Next.js 16 App Router, React 19, React Compiler, shadcn/ui. Bahasa Indonesia single-locale (no hreflang needed — confirm when this PRD starts).

## Scope

**In scope:**
- `frontend/src/app/layout.tsx` (root schema)
- New `frontend/src/lib/structured-data/` module for site-level JSON-LD helpers
- New doc `.pi/project/KEYWORD-MAPPING.md`
- `frontend/src/app/(public)/destinations/opengraph-image.tsx` (+ reusable generator)
- New `.pi/project/SEO-OPS.md` runbook (GSC, sitemap submission, monitoring)

**Out of scope:**
- Multi-locale/i18n + hreflang (single-locale site; revisit only if business expands)
- Programmatic SEO at scale (separate skill `programmatic-seo` if pursued)
- Ahrefs/Semrush paid tools integration
- City-detail-page schema (separate follow-on PRD once mapping done)

## Tasks

### T1. Root Organization + WebSite schema
Create `frontend/src/lib/structured-data/organization.ts` and `website.ts`:

**Organization** (use `TravelAgency` subclass of `LocalBusiness`):
```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "${siteUrl}/#organization",
  "name": "SultanatExplore",
  "url": "${siteUrl}",
  "logo": "${siteUrl}/logo.png",
  "image": "${siteUrl}/og/default.png",
  "description": "Agen wisata Turki terpercaya untuk traveler Indonesia...",
  "address": { "@type": "PostalAddress", "addressCountry": "TR", ... },
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+90-...",
    "contactType": "customer service",
    "areaServed": "ID",
    "availableLanguage": ["id", "tr", "en"]
  }],
  "sameAs": [ social profile URLs — confirm exact handles with PM ]
}
```

> **NAP accuracy is an E-E-A-T signal** — confirm exact Turkey address + WhatsApp number with PM/business before writing. Wrong NAP hurts LocalBusiness trust. Provide placeholders in PRD if unavailable; block T1 on confirmation.

**WebSite** (enables sitelinks search box):
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "${siteUrl}/#website",
  "url": "${siteUrl}",
  "name": "SultanatExplore",
  "publisher": { "@id": "${siteUrl}/#organization" },
  "potentialAction": [{
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "${siteUrl}/search?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }]
}
```

> **SearchAction caveat:** Only valid if a search results page exists at `/search?q=`. **Verify the route exists first** (`frontend/src/app/(public)/search`). If it doesn't, drop `potentialAction` for now — an invalid SearchAction can trigger a manual-action warning in GSC. Add the route as a separate ticket, then re-add SearchAction.

Render both in `frontend/src/app/layout.tsx` via `<script type="application/ld+json">` at top of `<body>` (inside `<main>` root is fine; positions before children render slow with `parsing प्रभाव`). Use `@/lib/structured-data/*` helpers.

Validate with [Rich Results Test](https://search.google.com/test/rich-results) on homepage.

### T2. Keyword mapping document
Create `.pi/project/KEYWORD-MAPPING.md` — living doc. Tabs/tables:

| Page (URL) | Primary keyword | Secondary | Search intent | Search vol (est) | Serp feature target | Notes |
|---|---|---|---|---|---|---|
| `/` | agen wisata turki | paket tour turki | commercial | medium | Organic | homepage pillar |
| `/destinations` | destinasi wisata turki | tempat wisata di turki | informational/discovery | medium-high | Breadcrumb | hub |
| `/destinations/{city}` e.g. `/destinations/istanbul` | wisata istanbul | destinasi istanbul | informational | high | ItemList, Breadcrumb | detail |
| `/destinations/{city}` Cappadocia | wisata cappadocia | — | informational | medium | — | detail |
| `/open-trip` | open trip turki | — | commercial | — | — | confirm route |
| `/private-trip` | private trip turki | — | commercial | — | — | |
| `/umrah` | paket umrah | umrah plus turki | commercial-transactional | high | FAQ, Offer | detail packs |
| `/artikel/{slug}` | varies | — | informational | — | Article | per post |

**Cannibalization review rules (document in the file):**
1. Every primary keyword is owned by exactly one URL. No two pages fight.
2. Hub `/destinations` targets the *head* ("destinasi wisata turki"); city detail owns the *tail* ("wisata istanbul").
3. Head term on hub never collides with detail tails — verified via `site:` query + Incognito SERP spot-check.
4. When adding a new page, append a row **before** building; reject if keyword clashes.
5. Link semantics: hub → detail uses keyword-natural anchors ("Lihat wisata Istanbul" not "klik di sini").

**Approach for execution session:**
- Start by listing all current public routes (`ls frontend/src/app/\(public\)` + recursive).
- For each, inspect `metadata.title` + H1 to infer intended keyword.
- Fill the table with current state + gaps.
- Flag dupes; propose merge/redirect or keyword re-target.

### T3. Dynamic OG image generation
Replace shipped static `frontend/public/og/destinations.png` (from PRD-02) with:

Create `frontend/src/app/(public)/destinations/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og"  // confirm export name in Next 16

export const runtime = "edge"  // or default — verify React Compiler + edge compat
export const alt = "Destinasi Wisata Turki — SultanatExplore"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ ... }}>
        <h1>Destinasi Wisata Turki</h1>
        <p>SultanatExplore</p>
      </div>
    ),
    { ...size }
  )
}
```

> **Next 16 caveat:** OG auto-generation API may differ from Next 15 (`opengraph-image.tsx` convention expected). Confirm by reading Next 16 release notes / the project's existing `next.config` before implementing. If `next/og` is deprecated/renamed, fall back to static PNG (PRD-02 already ships one) and document.

**Refactor:** once the conventions confirmed, move the renderer into a shared `frontend/src/lib/og/generate.ts` so city detail + blog pages reuse it (pass title + image src).

**Acceptance:** `curl -I /destinations/opengraph-image` returns `200 image/png` 1200×630. `metadata.openGraph.images` picks it up automatically (drop manual `images` override).

### T4. Google Search Console runbook
Write `.pi/project/SEO-OPS.md` covering:

- **Verification:** domain verification (preferred) — DNS TXT record owned by ops, not code. Alternative: HTML file upload to `/public`.
- **Sitemap submission:** add `https://sultanatexplore.com/sitemap.xml` once in GSC. Monitor Coverage report.
- **Indexation checks:** `site:sultanatexplore.com` spot tests for `/destinations` + 2 cities monthly.
- **Monitoring rituals:**
  - Weekly: inspect Coverage + Core Web Vitals + Manual Actions reports.
  - Monthly: indexation count delta, top queries for `/destinations` via Performance > Pages filter, position trends for primary keyword ("destinasi wisata turki").
  - Quarterly: validate `ItemList`/`BreadcrumbList`/`Organization` via Rich Results Test on homepage + 1 city detail.
- **Alerting:** set up GSC email forwarding or a structured digest; add to `LOG.md` when ranking shifts >5 positions for primary keyword.
- **Sitemap refresh cadence:** after every deploy that adds/removes public routes, note in deploy checklist.

> **Access:** GSC needs an owner account held by ops/founder. AI agent can't self-register. This task is documentation only until a human grants access. Optionally include Ahrefs Free / Bing Webmaster equivalents as cross-checks.

## Acceptance Criteria

- [ ] Root `layout.tsx` emits `Organization` (`TravelAgency`) + `WebSite` JSON-LD (or, if no `/search` route, WebSite without `potentialAction`).
- [ ] Rich Results Test on `/` shows valid `Organization` + `WebSite`, zero errors.
- [ ] `.pi/project/KEYWORD-MAPPING.md` exists with ≥1 row per public route; zero duplicate primary keywords.
- [ ] `/destinations` OG image served dynamically (or, if Next 16 blocks it, documented decision + static fallback retained).
- [ ] `.pi/project/SEO-OPS.md` runbook covers verification → submission → weekly/monthly/quarterly monitoring.
- [ ] `pnpm build` passes.
- [ ] NAP info (address, phone, `sameAs` social URLs) confirmed by PM — not guessed.

## Verification

```bash
cd frontend
pnpm typecheck && pnpm build
pnpm dev
curl -s localhost:3000 | grep -E "ld\+json"   # 2 root scripts: Organization, WebSite
curl -I localhost:3000/destinations/opengraph-image
# Rich Results Test (browser):
#   https://search.google.com/test/rich-results  → URL: http://localhost:3000
# OR after deploy: production URL
```

## Risks & Notes

- **NAP accuracy** — hard block on T1 `address`/`contactPoint` until PM confirms. Don't publish fabricated contact —trust signal penalty + bad UX.
- **SearchAction validity** — gate on existing `/search` route. Invalid SearchAction → GSC warning.
- **Dynamic OG + React Compiler / edge runtime** — React 19 + Compiler may not yet support `ImageResponse` JSX at edge. Build-test locally first; fall back to static if flaky.
- **Keyword mapping is a living doc** — not one-time. Add to `AGENTS.md` "Codebase Exploration Rule" row: "Before adding a public route, update KEYWORD-MAPPING.md".
- **GSC needs human-onboarding** — AI agent ships the runbook; a founder completes the claim.
- **i18n expansion** — single-locale now. If business adds English later, full hreflang cluster work needed (see seo-audit International SEO reference). Not this PRD.

## Files Touched

- `frontend/src/app/layout.tsx` (root schema render)
- `frontend/src/lib/structured-data/organization.ts` (new)
- `frontend/src/lib/structured-data/website.ts` (new)
- `frontend/src/app/(public)/destinations/opengraph-image.tsx` (new)
- `frontend/src/lib/og/generate.ts` (new — shared OG renderer)
- `.pi/project/KEYWORD-MAPPING.md` (new doc)
- `.pi/project/SEO-OPS.md` (new doc)
- `AGENTS.md` (add rule: update keyword mapping when adding public routes)