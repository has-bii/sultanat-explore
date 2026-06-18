---
date: 2026-06-18
title: Open Trip Form Layout Restyle + Custom Fetch Fields
tags: [form, open-trip, react-query, ui, refactor]
---

- **Decision:** Removed outer container (`mx-auto mt-10 max-w-4xl`) + page-level `Card` wrapper from both `CreateOpenTripPage` and `EditOpenTripPage`. Section Cards (Informasi Dasar, Itinerary, Inclusion, Tanggal) now top-level in `MainPageContent` — no card-in-card. Matches `EditCityPage` pattern (no `mx-auto max-w-*` wrapper, direct stack in `MainPageContent` `p-6`).
- **Reason:** Card-in-card = redundant border/shadow/heavy. `mt-10` stacked on `MainPageContent` `p-6` = extra 40px top gap.
- **Decision:** Merged Edit page double header. Top `h1` openTrip.title row + redundant "Edit Open Trip" Card sub-header → ONE header bar: `h1` title left, `DeleteOpenTripDialog` + Kembali button right.
- **Decision:** Actions footer replaced `<Field orientation="horizontal" className="justify-end">` with `<div className="flex justify-end gap-3 border-t pt-4">` for clear visual separation from form body.
- **Decision:** `FieldGroup` gap tightened `gap-7` → `gap-6` between top-level section cards.
- **Decision:** Created custom fetch fields — `CitySelectField`, `DestinationSelectField`, `InclusionItemSelectField` in `features/open-trip/components/form/select-fields.tsx`. Each encapsulates own data fetch (`useSuspenseInfiniteQuery` for cities/destinations, `useSuspenseQuery` for inclusion-items), flattens pages, renders `<Select>`. Own `<Suspense fallback={<Skeleton/>}>` inside field so only the field suspends, not whole page.
- **Reason:** User proposal — moves cities/destinations/inclusionItems fetching out of page-level props into each field. Kills prop drilling + reusable. react-query dedupes across many `CityEntry` instances (same queryKey = 1 fetch, cache shared).
- **Decision:** Placed custom fields in open-trip feature dir, NOT global `lib/form.tsx`. Created second `createFormHook` in `features/open-trip/components/form/use-app-form.ts` merging `baseFieldComponents` + 3 custom fields.
- **Reason:** Cleaner layering — `lib/form.tsx` stays generic (TextField, SelectField, etc). Feature-specific fetchers scoped to open-trip. Precedent: `ImagePickerField` already imports `@/features/image` in `lib/form.tsx`, but chose feature-scoped to avoid polluting global lib with 3 more feature query modules.
- **Decision:** `lib/form.tsx` refactored to export `baseFieldComponents` + `baseFormComponents` maps + individual field components (were private). `SelectField` gained `className` + `labelClassName` props (needed for nested entry styling: `labelClassName="text-xs"`, `className="flex-1"`/`"w-40"`).
- **Decision:** `use-open-trip-form.ts` swapped `useAppForm` import from `@/lib/form` → feature hook `../components/form/use-app-form`.
- **Decision:** `OpenTripForm` props shrunk `{form, mode, error, isPending}` — dropped `cities`, `destinations`, `inclusionItems`. `CityEntry`/`DestinationEntry`/`InclusionEntry` inline Select boilerplate replaced with `form.AppField` + custom fields. Dead ~80 lines per entry.
- **Decision:** Deleted `features/open-trip/components/form/form-types.ts` (only consumed by `form/index.tsx`, now unused after prop removal).
- **Decision:** Page-level fetches removed from both `CreateOpenTripPage` and `EditOpenTripPage` — `getCitiesQueryOptions`, `getDestinationsQueryOptions`, `getInclusionItemsQueryOptions` imports dead. Create page now only `useCreateOpenTrip` + `useOpenTripForm`. Edit page only `getOpenTripQueryOptions` + `useUpdateOpenTrip` + `useOpenTripForm`.
- **Decision:** Create page added page header row: title "Tambah Open Trip" + desc "Buat open trip baru" (was in outer Card header).
- **Decision:** `edit-skeleton.tsx` dropped `mx-auto mt-10 max-w-4xl` wrapper to match new layout.
- **No change:** route pages `app/admin/dashboard/open-trip/create/page.tsx` + `app/.../[id]/edit/page.tsx` — already just `MainPage` + `Header` + `MainPageContent` wrapper.
- **Verified:** `pnpm typecheck` clean, `pnpm lint` clean.
