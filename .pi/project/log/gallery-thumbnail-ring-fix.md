---
date: 2026-05-11
title: Gallery Thumbnail Ring Fix
tags: [destinasi, gallery, bugfix]
---

- **Decision:** Changed active thumbnail indicator from `ring-2 ring-offset` to `border-2 border-primary`
- **Reason:** `overflow-hidden` on thumbnail container clipped the ring. Border sits inside the box model, unaffected by overflow clipping.
