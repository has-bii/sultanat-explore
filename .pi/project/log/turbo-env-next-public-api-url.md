---
date: 2026-06-05
title: Turbo Env + API Client Config
tags: [config, turborepo, env, api-client]
---

- **Decision:** Add `NEXT_PUBLIC_API_URL` to turbo.json env allowlist
- **Reason:** `frontend/src/lib/api-client.ts` uses it for Hono RPC client (`hc<AppType>`)
- **Decision:** Add `api-client.ts` to ARCHITECTURE.md dependency map
- **Reason:** Documents client-side typed API call path
