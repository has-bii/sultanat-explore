---
date: 2026-06-14
title: Settings Page — Profile & Keamanan
---

- **Decision:** Add admin settings page at `/admin/dashboard/settings` with two sections: Profil (name + avatar) and Keamanan (change password)
- **Decision:** Avatar upload uses direct file upload (not ImagePickerDialog) — resize to 512x512 WebP, store in R2 under `avatars/` prefix
- **Decision:** Backend route mounted at `/api/me/avatar` with `requireAuth` middleware; avatar service is standalone in `modules/user/`
- **Decision:** Profile update via `authClient.updateUser()` (Better Auth built-in), password change via `authClient.changePassword()`
- **Decision:** NavUser "Account" dropdown link replaced with working "Pengaturan" link to settings page
- **Reason:** First settings module for admin dashboard. Keeps auth concerns in Better Auth, only uploads avatar through custom backend endpoint
