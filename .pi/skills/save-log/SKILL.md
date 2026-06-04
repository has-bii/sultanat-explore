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
7. Trim index to latest 5 rows:
   - Read LOG.md, collect all data rows after the `|---|---|---|` separator.
   - If rows > 5, delete all rows from row 6 onward (keep only top 5).
   - Use edit tool to replace everything from the 6th row to end of file with empty string.
8. Prune log files:
   - Collect filenames from the trimmed LOG.md rows (extract from markdown links).
   - List `.pi/project/log/*.md`, delete any file NOT in that keep list.
9. Keep log dir and LOG.md in sync — always exactly 5 entries.

## File Naming

- Slug from title, kebab-case, concise (2-4 words).
- Examples: `project-setup-and-docs.md`, `homepage-implementation.md`, `services-section-refinement.md`
