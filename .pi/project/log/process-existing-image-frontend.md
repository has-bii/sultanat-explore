---
date: 2026-06-28
title: Process Existing Image — admin frontend trigger
tags: [image, admin, frontend, react-query, mutation]
---

- **Decision:** Added `useProcessImage` mutation hook + `ProcessImageButton` in the image detail-sheet footer, visible only when `image.blurHash == null`. One click fires `POST /image/:id/process` directly — no confirm dialog.
- **Decision:** Hook named `useProcessImage` (no `Mutation` suffix) to match sibling hooks (`useDeleteImage`, `useUpdateImage`).
- **Decision:** Error mapping branches on carried HTTP status. `mutationFn` throws `Object.assign(new Error(json.message), { status })`; `onError` toasts the server message verbatim for 409/404/400 (they already match PRD strings) and overrides to `"Gagal memproses foto"` for 500/other.
- **Decision:** Hook toasts success + invalidates detail + list queries in `onSettled` unconditionally — sibling superset of the PRD's per-status invalidation needs, simplest correct path.
- **Decision:** Detail-sheet close guard extended to also block while the `process-image` mutation is pending, mirroring the existing `update-image` guard.
- **Decision:** Dropped the confirm `AlertDialog`. The re-encode produces a strictly-better webp (misclick cost near-zero) and the confirm was friction for a one-image maintenance button. Direct click + `ButtonLoading` pending affordance only.
- **Reason (confirm drop):** user feedback "too much click for just processing an image".