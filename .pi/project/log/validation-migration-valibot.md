# Validation Migration: Zod → Valibot

**Date:** 2026-06-13  
**Decision:** Replace Zod with Valibot as primary validation library across frontend and backend.

## Context
Project started with Zod for schema validation. Valibot chosen as replacement for:
- Smaller bundle size (tree-shakeable)
- Better TypeScript inference
- Standard Schema spec support (`@hono/standard-validator`)

## Changes

### Backend
- All module schemas (`image.schema.ts`, `destination.schema.ts`, `attraction.schema.ts`, `attraction-category.schema.ts`) migrated to Valibot
- Shared schemas (`param.schema.ts`, `query.schema.ts`) migrated to Valibot
- Validator wrapper changed from `zValidator` (`@hono/zod-validator`) to `sValidator` (`@hono/standard-validator`)
- Pattern: `import * as v from "valibot"`, schemas use `v.object()`, `v.pipe()`, `v.string()`, etc.

### Frontend
- Feature schemas use Valibot
- Form adapter: Standard Schema (native TanStack Form support, no adapter needed)

### Exception
- Auth schemas (`frontend/src/features/auth/dto/auth.schema.ts`) still use Zod — legacy, needs migration
- `zod` still in frontend `package.json` as dependency (to be removed after auth migration)

## Outcome
- All new schemas must use Valibot
- Zod not permitted for new code
- Auth schema migration deferred (low priority)
