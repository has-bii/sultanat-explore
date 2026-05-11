---
name: save-log
description: >-
  Create a new log entry file and update LOG.md index. Use after making architecture, convention, or scope decisions. Trigger: "save log", "log decision", "save decision".
---

# Save Log

Create a new log entry file in `.pi/project/log/` and add its reference to the LOG.md index.

## Instructions

1. Ask user: "What decision(s) to log?" if not obvious from context.
2. Generate a short kebab-case slug from the title (e.g. `services-section-refinement`).
3. Check `.pi/project/log/` for filename conflicts. Append `-2`, `-3` etc. if duplicate.
4. Create new file at `.pi/project/log/<slug>.md` using this template:

```markdown
---
date: YYYY-MM-DD
title: <Short Title>
tags: [<relevant>, <tags>]
---

- **Decision:** <what was decided>
- **Decision:** <another if multiple>
- **Reason:** <why> (optional, only if not obvious)
```

5. Read `.pi/project/LOG.md`.
6. Insert new row at the TOP of the table (after the `---` separator, before existing rows). Use edit tool — match the `| Date | Title | File |` header row as anchor, insert new row after the separator line `|---`.
7. Do NOT modify existing rows or log files.

## File Naming

- Slug from title, kebab-case, concise (2-4 words).
- Examples: `project-setup-and-docs.md`, `homepage-implementation.md`, `services-section-refinement.md`
