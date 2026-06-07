---
date: 2026-06-07
title: POST for Bulk Delete Endpoint
tags: [api, convention, decision]
---

- **Decision:** Use `POST /bulk-delete` instead of `DELETE` with query/body for bulk delete endpoints
- **Reason:** DELETE request body is unreliable across proxies, CDNs, and edge runtimes. Vercel edge runtime has inconsistent DELETE body behavior. POST guarantees delivery. Industry standard (GitHub, Stripe, AWS all use POST for bulk ops).
