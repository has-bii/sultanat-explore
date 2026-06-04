---
date: 2026-06-05
title: Image CRUD Frontend Research
tags: [frontend, image, prd, research]
---

- **Decision:** Sidebar group for "Foto" = "Platform" (not "Manajemen"). Matches existing `app-sidebar.tsx`.
- **Decision:** `nuqs` for URL state. ~2KB gzipped, type-safe, App Router native. No raw `useSearchParams`.
- **Decision:** `blurhash` npm pkg to decode raw blurHash → data URL at render time. Helper in `features/image/lib/blurhash.ts`. ~2KB, 0 deps. No backend change.
- **Decision:** `use-debounce` for search input. ~1KB, 0 deps. `useDebouncedCallback` hook.
- **Decision:** Hono RPC mutation typing follows existing `get-images.query.ts` pattern (`InferRequestType`/`InferResponseType`).
- **Decision:** New shadcn components to install: `dialog`, `alert-dialog`, `select`, `progress`. Audit done — none currently in `components/ui/`.
- **Decision:** `next.config.ts` must add `images.remotePatterns` entry for R2 hostname (read from `backend/.env` `R2_PUBLIC_DOMAIN`).
- **Decision:** `AbortController` owned by `useUploadImage` hook via `useRef`. Abort on modal close + hook unmount. Bypasses TanStack auto-cancel since upload uses raw XHR, not `mutationFn`.
- **Decision:** `useInfiniteQuery` (no codebase precedent but canonical pattern) for "Load more" with shared cache between library + picker Dialog.
- **Decision:** No `useSuspenseQuery` — codebase has no Suspense boundaries set up.
- **Reason:** Resolve all 7 grey areas in `image-crud-frontend-prd.md` §11 so implementation can start. See PRD §17 for the full decision log.
