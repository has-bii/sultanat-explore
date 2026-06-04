---
date: 2026-06-04
title: Project Docs Update
tags: [documentation, codebase, arch]
---

- **Decision:** Updated CODEBASE-DIRECTORY.md to reflect monorepo layout (frontend/src/, backend/), new admin dashboard files (sidebar, header, main-page, providers), new shadcn/ui components
- **Decision:** Updated ARCHITECTURE.md to add Turborepo, React Query, sonner, next-themes to stack; new Prisma content models (Destination, Image, Attraction); monorepo dependency map
- **Decision:** Updated CONVENTION.md with monorepo section, updated import aliases for frontend/ prefix
- **Decision:** Updated FEATURES.md — admin Destination Management to "In progress" (DB schema + shell pages done); added dashboard layout, React Query infra, toast/theme infra as done
- **Decision:** Updated PRD.md — section 4.3 updated for Destination Management status; admin infra details added
- **Reason:** Project restructured to monorepo (frontend/ + backend/) and new admin infrastructure added — docs were stale
