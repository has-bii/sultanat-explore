---
name: save-log
description: >-
  Append a decision entry to LOG.md. Use after making architecture, convention, or scope decisions. Trigger: "save log", "log decision", "save decision".
---

# Save Log

Append a new dated entry to `.claude/project/LOG.md`.

## Instructions

1. Read current `.claude/project/LOG.md`
2. Ask user: "What decision(s) to log?" if not obvious from context
3. Format new entry:

```
## YYYY-MM-DD — <Short Title>

- **Decision:** <what was decided>
- **Decision:** <another if multiple>
- **Reason:** <why> (optional, only if not obvious)
```

4. Insert new entry directly below the `---` separator, BEFORE existing entries (reverse chronological).
5. Do NOT modify or reorder existing entries.
6. Use the edit tool. Match the `---` line as anchor point. Insert after it.
