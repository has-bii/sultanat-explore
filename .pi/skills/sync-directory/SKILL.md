---
name: sync-directory
description: >-
  Regenerate CODEBASE-DIRECTORY.md from filesystem. Run after adding, removing,
  or moving files. Trigger: "sync directory", "update directory", "regenerate directory",
  "directory changed", "/sync-directory".
---

# Sync Directory

Regenerates `.pi/project/CODEBASE-DIRECTORY.md` by scanning the current project filesystem.

## Instructions

1. Run: `pnpm generate:dir`
2. Verify the output — check that new files appear and deleted files are gone.
3. If files were added/removed in a feature module, the tree will reflect it automatically.
4. If a new feature module was added, confirm it appears under `features/`.
5. Done — the doc is now in sync with the codebase.

## When to Run

- After creating or deleting files/directories
- After renaming or moving files
- After scaffolding a new feature module
- At the start of a session if you're unsure the doc is current
- Before committing large structural changes

## Notes

- The script lives at `scripts/generate-codebase-dir.js`
- It scans `frontend/src/` and `backend/src/` (skips `node_modules`, `.next`, `generated`, `.turbo`)
- Manual descriptions for well-known files are hardcoded in the script (DESCRIPTIONS map)
- To add descriptions for new files, edit the DESCRIPTIONS object in `scripts/generate-codebase-dir.js`
- The bash wrapper is at `scripts/generate-codebase-dir.sh` (calls the same logic)