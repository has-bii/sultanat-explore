---
date: 2026-06-28
title: Image Server-Side Processing and Blurhash Return
tags: [image, r2, sharp, blurhash, serverless, upload]
---

- **Decision:** Reintroduce server-side image processing (sharp → webp q80 ≤1920px `inside`) + blurhash (4×4, 64×64 source) inside `confirmImages`, resurrecting `backend/src/lib/image-processing.ts` from commit `4c56b39`.
- **Decision:** Bytes flow `client PUT → R2(original) → server GetObject → sharp → R2(webp) → delete(original)` — server never sees the body, sidestepping the Vercel body-size limit that originally killed processing.
- **Decision:** New processed asset is a fresh `.webp` key derived from the original key's path (via `r2KeyWithExt`); original is discarded (canonical asset = webp). DB row created **before** deleting the original so a DB failure leaves the original for retry.
- **Decision:** Add nullable `blurHash String?` to the `Image` model + migration `20260628063755_add_image_blurhash`. No backfill — existing rows read null and the frontend falls back to `?? PLACEHOLDER_BLURHASH`.
- **Decision:** `imageCardSelect` gains `blurHash`; 4 frontend render sites (image-card, picker-dialog, update-form, city row, destination row) use `image.blurHash ?? PLACEHOLDER_BLURHASH`. City **gallery** image-card stays on the placeholder (300px drag-thumb, optimistic `{id,url}` local state) — marked with a `ponytail:` note.
- **Decision:** Batch cap on presign + confirm lowered **10 → 3**. Reason: in-request sharp on ≤3 images (~1.5s each) fits Vercel Hobby's 10s wall-clock; 10 would 504. No queue/worker — admin-only, occasionally-hit endpoint doesn't earn one (A1 over A2/A3).
- **Reason:** Prior removal (commit `4c56b39`, 2026-06-19) was driven by Vercel body-size limits on the *old* client-POST-bytes flow, not by the spec quality. The presigned flow already solved the body-size problem; processing can return as a GET-then-PUT transform that never touches the body. Per-image blurhash (vs static placeholder) restores the loading-shimmer UX for hero/list imagery.
- **Reason:** Quality held at 80 (not the old 75) — hero imagery on a travel site is revenue-adjacent; ~15-20% size delta vs visible banding on sky gradients isn't worth the saving.
- **Carries forward:** `uploadAvatar` still uses `r2Upload` directly with **no** blurhash — gains it by importing `processImage` when avatar cards ask for a blur state (deferred, `ponytail:`-noted on `image-processing.ts`).