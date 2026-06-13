---
date: 2026-06-14
title: List Filter Hook Refactor
tags: [hooks, filters, convention, refactor]
---

- **Decision:** Extract shared `createFilterMethods` + `filterParsers` + `featuredParser` into `@/hooks/use-list-filters.ts`. Three feature hooks (`useAttractionFilters`, `useDestinationFilters`, `useImageFilters`) now spread shared parsers and delegate method logic to the factory.
- **Decision:** `featuredParser` is opt-in (separate export), not bundled in `filterParsers`. Features that need `featured` spread both `filterParsers` and `featuredParser`.
- **Reason:** Eliminates near-identical `onSearchChange`/`onSortOrderChange`/`onFeaturedChange` boilerplate across 3 hooks. Each feature still owns its nuqs schema (sort fields differ).