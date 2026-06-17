---
date: 2026-06-17
title: Form conventions audit and alignment
tags: [frontend, forms, conventions, docs]
---

- **Decision:** Updated `FRONTEND.md`, `FORM.md`, and `QUERY-MUTATION.md` to match current codebase practices.
- **Decision:** `ButtonLoading` is for async CTAs outside forms; form submit buttons use `<form.SubmitButton>` from `useAppForm`.
- **Decision:** Default form validation is `onChange`; auth and settings forms may use `onSubmit`.
- **Decision:** Simple create/edit dialogs may define `useAppForm` inline and call mutations directly when the dialog is the only consumer.
- **Decision:** Option 1 update mutations pass `{ id, input }` nested shape, matching `useUpdateCategory` / `useUpdateUserRole`.
- **Decision:** Boolean/checkbox fields must render `<FieldError errors={field.state.meta.errors} />` when invalid.
- **Code change:** Added `FieldError` to article content, article published checkbox, and destination featured checkbox.
- **Code change:** Changed settings profile/password forms from `onSubmit` to `onChange` validators.
