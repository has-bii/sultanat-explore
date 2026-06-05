---
date: 2026-06-05
title: BlurHash Required Field
tags: [schema, image, blurhash]
---

- **Decision:** Make `blurHash` field required (non-nullable) on Image model
- **Decision:** Remove null fallback in `blurhashToDataUrl` utility
- **Reason:** All images always have blurHash generated during upload, null state never useful
