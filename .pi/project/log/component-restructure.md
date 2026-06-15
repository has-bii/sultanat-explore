---
date: 2026-06-15
title: Component Restructure — Drop Prefixes, Group by Concern
tags: [refactor, components, convention]
---

- **Decision:** Restructured all feature component folders from flat prefixed files to grouped-by-concern subfolders
- **Decision:** Dropped feature prefix from component file names (path provides context)
- **Decision:** Thin skeleton wrappers inlined at call site; custom skeletons in `<concern>/skeleton.tsx`
- **Decision:** Stores always in separate `stores/` files, never inline in components
- **Reason:** Eliminate redundancy, improve discoverability, consistent structure across all features
