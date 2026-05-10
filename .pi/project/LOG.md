# Log

Reverse chronological. Append new decisions at top.

---

## 2026-05-11 — Project Setup & Docs

- **Decision:** Next.js 16 App Router + React 19 + TypeScript
- **Decision:** Tailwind CSS 4 only, no CSS modules or styled-components
- **Decision:** shadcn/ui (radix-vega style) for component library
- **Decision:** Feature-based architecture (`src/features/<domain>/`). Shared resources at top level (`src/components/`, `src/hooks/`, `src/lib/`)
- **Decision:** kebab-case file naming, PascalCase component exports
- **Decision:** Hardcoded Bahasa Indonesia, no i18n library
- **Decision:** CMS decision deferred. Start with static/hardcoded content.
- **Decision:** React Compiler enabled (babel plugin)
- **Decision:** pnpm as package manager
- **Decision:** Project docs split — CLAUDE.md at root, supporting docs in `.claude/project/`
