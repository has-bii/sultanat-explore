---
date: 2026-06-05
tags: [bugfix, image-processing, sharp, blurhash]
---

- **Decision:** Fix blurhash encoding error by adding `.ensureAlpha()` before `.raw()`
- **Reason:** `sharp().raw()` defaults to 3 channels (RGB), but `blurhash.encode()` called with components=4 (RGBA) — buffer size mismatch -> ValidationError
