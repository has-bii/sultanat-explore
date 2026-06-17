---
date: 2026-06-17
title: SelectField trailing prop
tags: [form, ui, component]
---

- **Decision:** Added `trailing?: ReactNode` prop to `SelectField` component in `lib/form.tsx`
- **Decision:** When `trailing` is present, wraps `SelectTrigger` in flex div with `items-end gap-2`, trigger gets `flex-1`
- **Decision:** Integrated `CategoryDialog` into article form using `trailing` prop — users can create categories inline without navigating to category page
- **Reason:** Reusable pattern for any select that needs an adjacent action button (e.g. create, refresh)
