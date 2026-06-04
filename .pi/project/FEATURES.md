# Features

Status of implemented features per PRD.

## Public Pages

| Feature | Status | Notes |
|---|---|---|
| Homepage | ✅ Done | Hero (motion marquee), about, services, destinations, testimonials, CTA, floating WhatsApp |
| Open Trip | ✅ Done | Listing + detail, trip cards, how-it-works, itinerary, inclusions, why-us, past-trip gallery, social proof |
| Private Trip | ✅ Done | Explanation, comparison table, benefits, process timeline, trip builder wizard (city → services → price estimate → WhatsApp), sample itineraries, gallery, testimonials, travel advisor, FAQ, social proof |
| Private Umrah | ✅ Done | Hero, social proof, explanation, packages (Standard/Premium/VIP), inclusions grid, itinerary preview, process timeline, gallery, testimonials, travel advisor, FAQ, CTA |
| Destinasi | ✅ Done | Listing (hero, featured, searchable grid, attractions, why-turkey) + detail (hero, about, gallery, related trips, other destinations, CTA) |
| Artikel | ✅ Done | Listing (hero, featured, filterable grid, search), detail (hero, content blocks, author card, related articles), 6 sample articles, SEO metadata |
| Collaborate | 🔲 Not started | KOL/influencer info + application |
| About Us | ✅ Done | Company story, team, values, testimonials, navbar dark-theme inversion |
| FAQ | ✅ Done | Dedicated /faq page, 6 categories (~20 questions), category filter, accordion, WhatsApp CTA. Link in navbar + footer |
| Contact | ✅ Done | Hero (dark gradient), contact cards (WA/IG/email), WhatsApp-based inquiry form, operating hours, FAQ mini-section, CTA |

## Global Features

| Feature | Status | Notes |
|---|---|---|
| Layout (header/footer) | ✅ Done | Navbar: flat text links, Indonesian labels, active underline, full-screen mobile overlay, dark-theme inversion. Footer: black bg, 4-col grid, ghost socials. 1136px max-width |
| Floating WhatsApp button | ✅ Done | Appears on scroll, links to WhatsApp with pre-filled message |
| Mobile-first responsive | ✅ Done | All pages responsive |
| Halal-friendly indicators | 🔲 Not started | Where relevant |
| Instagram embed | 🔲 Not started | Live feed on Homepage or Gallery |

## Admin Panel

| Feature | Status | Notes |
|---|---|---|
| Auth system | ✅ Done | Better Auth (email+password), login/forgot/reset pages, cookie-based session, proxy.ts protection |
| Dashboard | ✅ Done | Session-aware, user name + logout |
| Trip Management | 🔲 Not started | CRUD open trips + private packages |
| Article (SEO) | 🔲 Not started | Rich text editor, SEO fields, publish/draft |
| Gallery / Dokumentasi | 🔲 Not started | Photo/video upload per trip |

## Backend Infrastructure

| Feature | Status | Notes |
|---|---|---|
| Hono API | ✅ Done | Catch-all route at `src/app/api/[[...route]]`, CORS, error handling |
| Database (Neon + Prisma 7) | ✅ Done | PostgreSQL, adapter-based PrismaClient |
| Auth (Better Auth) | ✅ Done | Hono handler + Prisma adapter, email+password, disableSignUp |
| Email (Resend) | ✅ Done | Password reset emails with branded HTML template |
| CI/CD (GitHub Actions) | ✅ Done | Prisma migrate deploy + seed on push to main |
| Forms (TanStack React Form) | ✅ Done | useAppForm factory with TextField + SubmitButton |
| Vercel deployment | ✅ Done | next.config.ts + vercel.json configured |

## Out of Scope (Phase 1)

- Online payment gateway
- User accounts / login for clients
- Real-time booking confirmation system
- Multi-language support (English)
- Referral / affiliate program
