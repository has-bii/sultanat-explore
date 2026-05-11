---
date: 2026-05-11
title: Log System Restructure
tags: [tooling, workflow, docs]
---

- **Decision:** LOG.md converted from inline append to index table (date, title, file reference)
- **Decision:** Each log entry lives in its own file at `.pi/project/log/<slug>.md`
- **Decision:** Log files use YAML frontmatter template: date, title, tags + markdown body
- **Decision:** File naming: kebab-case slug, 2-4 words (e.g. `homepage-implementation.md`)
- **Decision:** save-log skill updated: create file + insert index row
- **Decision:** load-log skill updated: read index + referenced files
- **Decision:** Existing 3 entries migrated to separate files
