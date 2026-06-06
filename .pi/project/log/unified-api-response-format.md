---
date: 2026-06-06
title: Unified API Response Format
tags: [backend, api, convention]
---

- **Decision:** Standardize all API responses to `{ success: true, data, message }` (success) and `{ success: false, data: null, message, error }` (error).
- **Decision:** Created `backend/src/utils/response.ts` with `successResponse()` and `errorResponse()` helpers.
- **Decision:** Updated `app.ts` global `onError` / `notFound` handlers to use `errorResponse()`.
- **Decision:** Updated `image.route.ts` to wrap all endpoint responses with `successResponse()`.
- **Reason:** Consistent contract for frontend consumers — single shape to destructure regardless of endpoint.
