---
date: 2026-06-17
title: Form Conventions Doc + Auth Form Migration
tags: [conventions, forms, auth, frontend]
---

- **Decision:** Create `.pi/project/frontend/FORM.md` as the living guideline for TanStack React Form patterns: `useAppForm` factory usage, custom hook conventions, form component conventions, schema source rules, error display via mutation `error` + `<ErrorComponent>`.
- **Decision:** Link `FORM.md` from `FRONTEND.md` and `CODEBASE-DIRECTORY.md`.
- **Decision:** Migrate all 3 auth forms (login, forgot-password, reset-password) from direct `authClient` calls to mutation hooks (`useLogin`, `useForgotPassword`, `useResetPassword`) matching the new mutation conventions.
- **Decision:** Switch auth form validation from `onSubmit` to `onChange` for immediate feedback.
- **Decision:** Replace local `formError` state with mutation `error` + `<ErrorComponent>` pattern.
- **Decision:** Add `e.stopPropagation()` and `isDisabled={isPending}` to all auth form submit wiring.
- **Reason:** Auth forms were the last holdouts not using the standard mutation pattern. Creating FORM.md codifies the conventions established during auth form refactoring, preventing drift in future form implementations.
