# Phase 6: Verify + Fix Stragglers

## Goal

Final verification pass. Fix any remaining references, run full typecheck, manual test.

## Prerequisites

- [ ] Phase 5 complete (public feature refs updated)

## Steps

### 6.1 Full typecheck

```bash
pnpm typecheck
```

Fix all errors. Expected error sources:
- Missed renames in any file
- Prisma generated types vs. manual type assertions
- Import path mismatches

### 6.2 Grep for old names

```bash
# In backend/src and frontend/src — should return zero results (excluding comments/docs)
grep -rn "model Destination\|model Attraction\|DestinationImage" backend/prisma/
grep -rn "from.*destination.*route\|from.*attraction.*route" backend/src/
grep -rn "features/destination/\|features/attraction/" frontend/src/
grep -rn "prisma\.destination\b\|prisma\.attraction\b" backend/src/
```

### 6.3 Lint

```bash
pnpm lint
```

Fix any lint errors introduced by renames.

### 6.4 Build

```bash
pnpm build
```

Verify production build succeeds.

### 6.5 Manual test — Admin

- [ ] Login to admin dashboard
- [ ] Navigate to `/admin/dashboard/city` — list loads
- [ ] Create new city — form works
- [ ] Edit city — form works, gallery works
- [ ] Navigate to `/admin/dashboard/city/destination` — list loads
- [ ] Create new destination (old attraction) — form works, city dropdown shows cities
- [ ] Edit destination — form works
- [ ] Delete city/destination — confirmation works
- [ ] Sidebar navigation correct

### 6.6 Manual test — Public

- [ ] Homepage loads, destination section renders
- [ ] `/destinations` page loads, grid renders
- [ ] `/destinations/[slug]` detail page loads
- [ ] Featured attractions section on detail page renders

### 6.7 Update documentation

Update these docs to reflect new naming:
- `.pi/project/ARCHITECTURE.md` — Database Models section
- `.pi/project/CODEBASE-DIRECTORY.md` — folder structure
- `.pi/project/FRONTEND.md` — if any destination/attraction examples
- `.pi/project/BACKEND.md` — if any destination/attraction examples
- `.pi/project/LOG.md` — log this migration decision

### 6.8 Mark plan complete

Update `.pi/project/DESTINATION-ATTRACTION-MIGRATION-PLAN.md` checklist — all items checked.

## Verification

- [ ] `pnpm typecheck` passes (zero errors)
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] All admin CRUD operations work
- [ ] All public pages render correctly
- [ ] No references to old model names in source code
- [ ] Documentation updated

## Notes

- This phase is the catch-all. If something was missed in phases 1-5, it surfaces here.
- Keep this phase until everything green. Don't rush to mark complete.
