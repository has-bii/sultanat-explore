---
date: 2026-06-15
title: Remove Husky Auto-Install on pnpm install
tags: [husky, pnpm, scripts]
---

- **Decision:** Removed `"prepare": "husky"` from package.json scripts
- **Reason:** Husky was running automatically on every `pnpm install` via the prepare script. User wanted manual control over when husky installs its git hooks.