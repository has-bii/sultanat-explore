---
name: load-log
description: >-
  Read the most recent decision from LOG.md. Use when resuming work, checking the latest decision, or understanding what was last done. Trigger: "load log", "show log", "what was decided", "latest decision".
---

# Load Last Log

Read `.pi/project/LOG.md` index and present only the **most recent** log entry.

## Instructions

1. Read `.pi/project/LOG.md` — this is an index table (date, title, file reference), reverse chronological.
2. Take only the **first entry** in the table (most recent).
3. Read the corresponding file from `.pi/project/log/<slug>.md`.
4. Print the entry's full content — do not summarize or truncate.
5. If index empty or missing: report "No log entries yet."
6. No edits. Read-only.

## Filtering

If user asks about a specific topic or tag:
- Search all entries in the index for matching tags in their YAML frontmatter.
- Only present matching entries.
- Otherwise, default to last entry only.
