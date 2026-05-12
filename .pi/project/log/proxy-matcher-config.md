---
date: 2026-05-13
title: Proxy Matcher Config
tags: [proxy, middleware, nextjs16]
---

- **Decision:** Added `config` export with `matcher: ["/admin/:path*"]` to `src/proxy.ts`
- **Reason:** Next.js 16 uses `proxy.ts` (not `middleware.ts`). Without matcher, proxy runs on every route including static assets. Matcher scopes execution to `/admin/*` only.
