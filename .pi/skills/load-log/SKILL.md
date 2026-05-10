---
name: load-log
description: >-
  Read and summarize the decision timeline from LOG.md. Use when resuming work, checking past decisions, or understanding project history. Trigger: "load log", "show log", "what was decided", "decision history".
---

# Load Log

Read `.claude/project/LOG.md` and present the decision timeline.

## Instructions

1. Read `.claude/project/LOG.md` using `ctx_execute_file` (file may grow large).
2. Print full log content as-is — do not summarize or truncate.
3. If file empty or missing: report "No log entries yet."
4. No edits. Read-only.
