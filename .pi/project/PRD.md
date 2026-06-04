# Product Requirements Document
## SultanatExplore Website

**Version:** 2.0  
**Last Updated:** June 2026  
**Status:** Active

---

## 1. Overview

SultanatExplore is a Turkey-based travel agency serving Indonesian travelers. Website covers brand awareness, service presentation, and WhatsApp-driven inquiries. Public pages complete. Remaining work: Collaborate page, Admin CMS modules, minor global features.

---

## 2. Goals

- Establish online presence and brand credibility
- Educate Indonesian audiences about travel services offered
- Drive inquiries via WhatsApp for trip bookings
- Attract potential collaborators (travel influencers / KOL)
- Support SEO growth through articles and destination content

---

## 3. Target Audience

- Indonesian travelers interested in visiting Turkey
- Muslim travelers looking for halal-friendly or Umrah travel experiences
- Travel influencers / content creators looking to collaborate

---

## 4. Site Structure

### 4.1 Completed Pages (Built, minor maintenance only)

| Page | Notes |
|---|---|
| **Homepage** | Hero (motion marquee), about, services, destinations, testimonials, CTA, floating WhatsApp |
| **Open Trip** | Listing + detail, trip cards, itinerary, inclusions, social proof, past-trip gallery |
| **Private Trip** | Explanation, comparison table, trip builder wizard, sample itineraries, gallery, testimonials, FAQ |
| **Private Umrah** | Hero, social proof, packages (Standard/Premium/VIP), inclusions, itinerary, process, gallery, testimonials, FAQ |
| **Destinasi** | Listing (hero, featured, searchable grid) + detail (hero, gallery, related trips, CTA) |
| **Artikel** | Listing (hero, featured, filterable grid, search) + detail (content blocks, author, related) + 6 sample articles |
| **About Us** | Company story, team, values, testimonials, navbar dark-theme inversion |
| **FAQ** | 6 categories (~20 questions), category filter, accordion, WhatsApp CTA |
| **Contact** | Contact cards (WA/IG/email), inquiry form, operating hours, FAQ mini-section |

### 4.2 Remaining Pages

| Page | Priority | Status |
|---|---|---|
| **Collaborate** | Medium | 🔲 Not started — KOL/influencer info + application form or WhatsApp CTA |

### 4.3 Admin Panel

| Module | Priority | Status |
|---|---|---|
| Auth (login/forgot/reset) | Required | ✅ Done — Better Auth + Hono API + Prisma/Neon |
| Dashboard | Required | ✅ Done — session-aware redirect, logout |
| Trip Management | High | 🔲 Not started — CRUD for open trips + private packages |
| Article (SEO) | High | 🔲 Not started — rich text editor, SEO fields, publish/draft |
| Gallery / Dokumentasi | Medium | 🔲 Not started — photo/video upload per trip or destination |

---

## 5. Page Requirements — Remaining

### 5.1 Collaborate
- Who SultanatExplore is looking to collaborate with
- What collaborators get (e.g. free/subsidized trips, content opportunities)
- Inquiry/application form or WhatsApp CTA

---

## 6. Global Features

| Feature | Status | Notes |
|---|---|---|
| Language: Bahasa Indonesia | ✅ Done | Hardcoded |
| Currency: IDR | ✅ Done | |
| WhatsApp CTA | ✅ Done | Floating button all pages |
| Mobile-first responsive | ✅ Done | |
| Halal-friendly indicators | 🔲 Not started | Where relevant |
| Instagram embed | 🔲 Not started | Live feed on Homepage or Gallery |

---

## 7. Admin Panel Requirements — Remaining

### Trip Management
- Add / edit / delete open trips and private trip packages
- Set trip dates, pricing, seat capacity, and availability status
- Upload trip photos and itinerary details

### Article (SEO)
- Rich text editor for writing articles
- SEO fields: meta title, meta description, slug
- Publish / draft / schedule status

### Gallery / Dokumentasi
- Upload photos and videos per trip or destination
- Organize by category or trip

---

## 8. Out of Scope (Phase 1)

- Online payment gateway
- User accounts / login for clients
- Real-time booking confirmation system
- Multi-language support (English)
- Referral / affiliate program
