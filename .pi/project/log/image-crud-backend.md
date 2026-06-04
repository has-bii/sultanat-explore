---
date: 2026-06-04
title: Image CRUD Backend
tags: [backend, api, image, r2, sharp, blurhash]
---

- **Decision:** Implemented full image CRUD backend with Cloudflare R2 storage
- **Decision:** GET endpoints are public (no auth), mutations require auth
- **Decision:** Shared middleware pattern: `requireAuth` + `zValidator` wrapper
- **Decision:** Backend module structure: `modules/<domain>/` with route, service, schema files
- **Decision:** Added `fileSize` (Int) + `blurHash` (String?) fields to Image model
- **Reason:** Public frontend pages need to read images without login. Shared validators reduce boilerplate for future features.
