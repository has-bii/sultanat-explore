---
date: 2026-05-12
title: Layout Separation Public Admin Auth
tags: [layout, route-groups, auth, admin]
---

- **Decision:** Root layout stripped to fonts + html + body only. Navbar/Footer moved to `(public)` route group layout.
- **Decision:** Public pages moved into `src/app/(public)/` route group. URLs unchanged.
- **Decision:** Auth pages (login, forgot-password, reset-password) moved into `src/app/admin/(auth)/` route group with shared centered layout (`min-h-dvh` + `max-w-sm`).
- **Decision:** `/admin` index page added — redirects to `/admin/dashboard` if authenticated, `/admin/login` if not.
- **Reason:** Separate public chrome from admin. Auth pages share identical wrapper — extracted to avoid duplication.
