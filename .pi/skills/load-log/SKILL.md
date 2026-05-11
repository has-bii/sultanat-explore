---
name: load-log
description: >-
  Read the decision timeline from LOG.md index and all log entry files. Use when resuming work, checking past decisions, or understanding project history. Trigger: "load log", "show log", "what was decided", "decision history".
---

# Load Log

Read `.pi/project/LOG.md` index and present the full decision timeline.

## Instructions

1. Read `.pi/project/LOG.md` — this is now an index table (date, title, file reference).
2. For each entry in the index, read the corresponding file from `.pi/project/log/<slug>.md`.
3. Present entries in reverse chronological order (as listed in index).
4. Print each entry's full content — do not summarize or truncate.
5. If index empty or missing: report "No log entries yet."
6. No edits. Read-only.

## Filtering

If user asks about a specific topic or tag:
- Check each log file's YAML frontmatter `tags` field.
- Only present matching entries.
