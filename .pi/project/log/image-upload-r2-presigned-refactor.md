---
date: 2026-06-19
title: Image Upload R2 Presigned + Blurhash Removal
tags: [image, upload, r2, blurhash, refactor]
---

- **Decision:** Remove blurhash — dropped `blurhash` dep from backend/frontend, removed `blurHash` field from Prisma schema, deleted server-side `image-processing.ts`, replaced all `blurDataURL` references with a static placeholder blurhash
- **Decision:** Switch to R2 presigned upload — added `@aws-sdk/s3-request-presigner`, configured `forcePathStyle`, built presigned POST flow so frontend uploads directly to R2
- **Decision:** Add upload queue hook (`use-upload-queue`) with presign/confirm mutations and `upload-to-r2` lib
- **Decision:** Refactor upload dialog — `DndImages` uses `File[]` instead of `Map<string, File>`, `FileListItem` with status-based rendering (pending/uploading/success/error)
