---
date: 2026-05-13
title: Resend Email Module Extraction
tags: [resend, auth, refactoring]
---

- **Decision:** Extract Resend email logic from `auth.ts` into dedicated `resend.ts` module
- **Decision:** `sendResetPasswordEmail()` in `resend.ts` — pure email send, no env checks
- **Decision:** `NODE_ENV` guard in `auth.ts` — dev → log URL, prod → send email
- **Reason:** Separation of concerns. Resend owns email content/format. Auth owns flow control (dev vs prod).
