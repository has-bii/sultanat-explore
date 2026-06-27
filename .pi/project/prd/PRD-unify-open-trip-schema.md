# PRD: Unify Open Trip create/update schema + drop `_key` augmentation

**Status:** Ready to execute
**Scope:** Full stack (backend schema/route/service + frontend hook/form). Load `ARCHITECTURE` + `FRONTEND` + `BACKEND` (per AGENTS.md "Full stack / cross-cutting").
**Estimated impact:** ~−50 to −60 net lines (supersedes the −12 already shipped this session). Eliminates the only `_key`-tracking surface in the feature and lets the form pass the valibot schema directly to TanStack Form's `onChange`.
**Risk:** PUT `/open-trips/:id` becomes full-replace only (no partial body). Verified safe — see "Trade-off" below; no in-repo caller uses partial update.

---

## One-line goal

Merge `createOpenTripSchema` and `updateOpenTripSchema` into one required-fields schema. Delete the runtime `_key` augmentation from the form. Now that the form's value type equals the schema input type exactly, pass `createOpenTripSchema` directly to `onChange` (matching every sibling form) instead of the manual `v.safeParse` wrapper.

---

## Why (background)

`useOpenTripForm` is the **only** form in the repo that can't pass its schema straight to `validators.onChange`. Two structural deltas force a manual `onChange: ({ value }) => v.safeParse(schema, value).issues` shim:

1. **`_key: string`** on every `cities`/`inclusions` row — added for stable React keys across `moveValue`/`removeValue`.
2. **`cities`/`inclusions` widened from optional to required arrays** — so the UI can `.map()`/`pushValue()` without `undefined` guards.

TanStack Form types a bare schema slot as `StandardSchemaV1<formValue>`, which asserts `schemaInput ≡ formValue`. Both deltas violate that. Sibling forms (`useCategoryForm`, `useCityForm`, `useArticleForm`, …) pass schemas directly only because their form value type is verbatim the schema input.

Both deltas dissolve together if the merged schema makes `cities`/`inclusions`/`status` required **and** the form drops `_key`. Then `OpenTripFormValues === CreateOpenTripInput`, the `safeParse` shim retires, and the partial-update `updateOpenTripSchema` (currently the only consumer of the optional shape) is deleted.

---

## Current repo state (ground truth — do NOT redo these)

A prior session already applied these changes. Build on top; do not re-apply:

- `backend/.../open-trip.schema.ts` — `openTripDestinationInputSchema` has **only `destinationId`** (the `order` field is already removed; `order` is server-derived from array index).
- `backend/.../open-trip.service.ts` — `validateCities` is deleted; `buildNestedCreate` and the update-path both derive `order: idx`. `UpdateOpenTripInput` is still imported and `updateOpenTrip` still typed against it.
- `frontend/.../use-open-trip-form.ts` — only `OpenTripInclusionRow` is still `export`ed (the others were de-exported). `_key` augmentation, `nextKey()`, and the `safeParse` `onChange` wrapper **still present**.
- `frontend/.../form/index.tsx` — the destinations `pushValue` already drops `order` (it's `{ destinationId: "", _key: crypto.randomUUID() }`).
- `frontend/.../edit-open-trip.page.tsx` — the destinations map is `{ destinationId: dest.destinationId }` (no `order`, no `_key`).
- `frontend/.../create-open-trip.page.tsx` — no `_key`/`order` references (verify only; no edit expected).

`pnpm typecheck` and `pnpm lint` are green at this state.

---

## Changes by file

### 1. `backend/src/modules/open-trip/open-trip.schema.ts`

**a) Make `status`/`cities`/`inclusions` required on `createOpenTripSchema`:**
- `status: v.optional(v.picklist(["draft", "published", "archived"]), "draft")` → `status: v.picklist(["draft", "published", "archived"])`
- `cities: v.optional(v.array(openTripCityInputSchema), [])` → `cities: v.array(openTripCityInputSchema)`
- `inclusions: v.optional(v.array(openTripInclusionInputSchema), [])` → `inclusions: v.array(openTripInclusionInputSchema)`

**b) Delete the entire `updateOpenTripSchema` block** (the second `v.object({...})` with all the `v.optional(...)` wrappers, from the `// ── Create / Update ───` divider's update section through its closing `})`).

**c) Delete the type:**
```ts
export type UpdateOpenTripInput = v.InferInput<typeof updateOpenTripSchema>
```

**d) Add one ponytail comment above `createOpenTripSchema`:**
```ts
// ponytail: full-replace schema — merged create/update. No partial PUT; the single admin UI
// always sends a full body. Add a partial variant only when a real partial-update caller exists.
```

Leave `openTripDestinationInputSchema` (no `order`), `openTripQuerySchema`, `openTripSlugParamSchema`, and the remaining inferred types untouched.

---

### 2. `backend/src/modules/open-trip/open-trip.route.ts`

- Remove `updateOpenTripSchema` from the schema import list (line ~10).
- Line ~57: `sValidator("json", updateOpenTripSchema)` → `sValidator("json", createOpenTripSchema)`.

Everything else unchanged.

---

### 3. `backend/src/modules/open-trip/open-trip.service.ts`

- Remove `UpdateOpenTripInput` from the `import type { … }` list (line ~6–11).
- Change signature: `export async function updateOpenTrip(id: string, input: UpdateOpenTripInput)` → `export async function updateOpenTrip(id: string, input: CreateOpenTripInput)`.
- Collapse optional-input guards into unconditional assignments. The function currently reads:
  ```ts
  // Check slug collision
  if (input.slug) { … findFirst slug != id … }
  // Check cover image exists
  if (input.coverImageId) { … }
  const cities = input.cities ?? []
  const inclusions = input.inclusions ?? []
  if (input.cities !== undefined) {
    // duplicate-inclusions check
  }
  validateDateRange(input.startAt, input.endAt)
  …
  if (input.slug !== undefined) data.slug = input.slug
  if (input.title !== undefined) data.title = input.title
  // … same pattern for excerpt/description/price/coverImageId/startAt/endAt/status …
  if (input.cities !== undefined) { data.cities = { deleteMany: {}, create: … } }
  if (input.inclusions !== undefined) { data.inclusions = { deleteMany: {}, create: … } }
  ```
  Target (all fields now required):
  ```ts
  // Slug collision (self-excluded → idempotent when slug unchanged)
  const slugTaken = await db.openTrip.findFirst({ where: { slug: input.slug, id: { not: id } } })
  if (slugTaken) throw new HTTPException(400, { message: "Slug sudah digunakan" })

  // Cover image exists
  const image = await db.image.findUnique({ where: { id: input.coverImageId } })
  if (!image) throw new HTTPException(400, { message: "Gambar sampul tidak ditemukan" })

  const cities = input.cities
  const inclusions = input.inclusions

  // Duplicate inclusions (now unconditional — was oddly nested under the cities check)
  const inclusionIds = inclusions.map((i) => i.inclusionItemId)
  if (new Set(inclusionIds).size !== inclusionIds.length) {
    throw new HTTPException(400, { message: "Inclusion item tidak boleh duplikat" })
  }

  validateDateRange(input.startAt, input.endAt)

  // publishedAt logic: immutable after first set  ← KEEP this block as-is
  let publishedAt = existing.publishedAt
  if (input.status === "published" && existing.status !== "published" && !existing.publishedAt) {
    publishedAt = new Date()
  }

  const data: Prisma.OpenTripUpdateInput = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    description: input.description as Prisma.InputJsonValue,
    price: input.price,
    coverImage: { connect: { id: input.coverImageId } },
    startAt: new Date(input.startAt),
    endAt: new Date(input.endAt),
    status: input.status,
  }
  if (publishedAt !== existing.publishedAt) data.publishedAt = publishedAt

  // Full-replace nested (unconditional)
  data.cities = {
    deleteMany: {},
    create: cities.map((city) => ({
      cityId: city.cityId,
      arriveAt: new Date(city.arriveAt),
      destinations: {
        create: city.destinations.map((dest, j) => ({
          destinationId: dest.destinationId,
          order: j,   // ← keep: server-derived. DB @@unique([openTripCityId, order]) still satisfied.
        })),
      },
    })),
  }
  data.inclusions = {
    deleteMany: {},
    create: inclusions.map((inc) => ({ inclusionItemId: inc.inclusionItemId, type: inc.type })),
  }
  ```
  Keep the final `return db.openTrip.update({ where: { id }, data, include: includeDetail })`.

- `buildNestedCreate` (used by `createOpenTrip`) already derives `order: idx` and types `destinations?: { destinationId: string }[]` — leave it. Optionally tighten its `cities`/`inclusions` arg types to required arrays now that the schema guarantees them, but not required for green typecheck.

---

### 4. `frontend/src/features/open-trip/hooks/use-open-trip-form.ts`

The hook should converge to the `useArticleForm` shape (see `frontend/src/features/article/hooks/use-article-form.ts` as the reference).

- Delete `import * as v from "valibot"` (no longer needed — no `safeParse`).
- Delete the comment block about `_key`/`safeParse` (lines ~10–15).
- Delete the helper types `CityIn`, `DestIn`, `IncIn`, and all four augmented types (`OpenTripDestRow`, `OpenTripCityRow`, `OpenTripInclusionRow`, `OpenTripFormValues`).
- Delete `function nextKey()`.
- `defaultValues` type: `OpenTripFormValues` → `CreateOpenTripInput`.
- In the `defaultValues` object, drop every `_key: nextKey()` (cities, destinations, inclusions). The cities/destinations/inclusions maps become plain projections of `{ destinationId }` / `{ cityId, arriveAt, destinations }` / `{ inclusionItemId, type }`.
- `validators: { onChange: ({ value }) => v.safeParse(createOpenTripSchema, value).issues }` → `validators: { onChange: createOpenTripSchema }`.
- `onSubmit`: the current clean step only strips `_key` (order already removed). With `_key` gone, `value` is already `CreateOpenTripInput` — collapse to:
  ```ts
  onSubmit: async ({ value }) => {
    await onSubmit(value)
  },
  ```
- Keep `Props` (`defaultValues?: Partial<CreateOpenTripInput>`) and the `useAppForm` import path (`../components/form/use-app-form` — feature-local, unchanged).

Target hook is ~25 lines and structurally identical to `useArticleForm`.

---

### 5. `frontend/src/features/open-trip/components/form/index.tsx`

- Remove `OpenTripInclusionRow` from the hook import: `import { type OpenTripInclusionRow, useOpenTripForm }` → `import { useOpenTripForm }`. Add `import type { CreateOpenTripInput } from "backend/modules/open-trip/open-trip.schema"` if not present (needed for the type replacement below).
- `InclusionColumn` props: replace `inclusions: OpenTripInclusionRow[]` with `inclusions: CreateOpenTripInput["inclusions"]` (the array type; `[number]` if you need a row, but the prop is the array).

- **React keys → array index** (3 sites):
  - `key={city._key}` → `key={cityIndex}`
  - `key={dest._key}` → `key={destIndex}`
  - `key={inc._key}` → `key={inc._idx}`  *(see note — `_idx` stays, it is NOT just a key)*

- **`_key:` in `pushValue`** (4 sites) — delete the `_key` property:
  - cities push: `{ cityId: "", arriveAt: "", destinations: [], _key: crypto.randomUUID() }` → `{ cityId: "", arriveAt: "", destinations: [] }`
  - destinations push: `{ destinationId: "", _key: crypto.randomUUID() }` → `{ destinationId: "" }`
  - include-column push: `{ inclusionItemId: "", type: "include", _key: crypto.randomUUID() }` → `{ inclusionItemId: "", type: "include" }`
  - exclude-column push: same, `type: "exclude"`.

- **`_idx` — DO NOT delete.** In `InclusionColumn`, `rows = inclusions.map((inc, idx) => ({ ...inc, _idx: idx })).filter((inc) => inc.type === type)`. The `_idx` is the **original form-array position**, passed as `incIndex={inc._idx}` to drive the field path `inclusions[${incIndex}].inclusionItemId`. It is load-bearing. After dropping `_key`, it doubles as the React key (`key={inc._idx}`). This is the ponytail move — `_idx` already exists, no new id needed.

No other component changes. `CityEntry`, `DestinationEntry`, `InclusionEntry` have no `useState` and no uncontrolled text inputs — they are path-driven controlled selects, which is why index keys are safe here (see Rationale).

---

### 6. `frontend/src/features/open-trip/pages/edit-open-trip.page.tsx`

Already clean after the prior session. **Verify only** — no `_key`/`order` references. The destinations map should read `{ destinationId: dest.destinationId }`.

### 7. `frontend/src/features/open-trip/pages/create-open-trip.page.tsx`

**Verify only** — no `_key`/`order` references; no edit expected.

---

## Rationale: why index keys are safe here (verified)

The classic "don't use array index as React key" warning targets **uncontrolled inputs with transient typing state** — reorder swaps identities, the focused input ends up bound to the wrong row.

Confirmed by reading all three row components: **no `useState`, no uncontrolled text inputs.** Every field is either:
- `form.AppField`/`form.Field` rendering a controlled `Select` (`CityOptions`, `DestinationOptions`, `InclusionItemSelectField` — all `useFieldContext` + `useSuspenseInfiniteQuery`), or
- a `<field.DateField>` (a native date input bound to form state).

All values are **path-driven** (`cities[${cityIndex}].destinations[${destIndex}].destinationId`, etc.). After `destField.moveValue(i, i-1)`, React reconciles by index key, but each render pulls its value from form state by path — so the DOM node at position `i` renders the value now stored at path `[…i]`, which is the row that conceptually moved there. **No identity swap bug: value correctness is decoupled from DOM reuse.** The only effect of index keys is DOM-node recycling (perf, not correctness) — acceptable.

Add a one-line `// ponytail:` comment where the index keys are introduced (the `form.Field name="cities" mode="array"` region) noting: controlled-select rows, index keys safe; revisit if a free-text field is added inside a reorderable row.

---

## Trade-off (the one real cost)

PUT `/open-trips/:id` stops accepting partial bodies. A client sending only `{ status: "archived" }` or `{ slug: "x" }` would now fail validation (all required fields missing).

**Verified safe:**
- Grepped repo: the only PUT consumer is `useUpdateOpenTrip` (`frontend/.../mutations/update-open-trip.mutation.ts`), called exclusively from `edit-open-trip.page.tsx`, which builds a **full body** from `getOpenTripById` (every scalar populated, `cities`/`inclusions` projected).
- The "archive by partial PUT" path does not exist — soft-delete lives on DELETE (`deleteOpenTrip` sets `status: "archived"`).
- No mobile/external API consumer in repo.

So the partial-update capability is **speculative and unbuilt** — deleting it is the YAGNI move. Document the contract change with the `ponytail:` comment in the schema (step 1d) and a LOG.md entry (see Verification).

---

## Verification gates (all must pass)

1. **Type check:** `pnpm typecheck` (run at repo root — Turborepo fans out to both packages). Must be green.
   - Key assertion: `onChange: createOpenTripSchema` must NOT emit the prior `StandardSchemaV1<formValue>` mismatch. If it does, `OpenTripFormValues` augmentation or some `_key` residue remains — grep `_key|OpenTripFormValues` in the feature and remove.
   - Confirm `updateOpenTrip`'s param type is `CreateOpenTripInput` and no `UpdateOpenTripInput` reference remains anywhere: `grep -rn "UpdateOpenTripInput" backend frontend`.
2. **Lint:** `frontend` — `pnpm lint`; `backend` — `pnpm lint`. Both must be clean.
3. **Manual smoke** (`pnpm dev`, navigate `/admin/dashboard/open-trip`):
   - **Create flow:** new trip, add 2 cities, each with 2 destinations. **Reorder destinations** (move up/down), **remove** a middle destination, add a fresh destination (empty `destinationId`). Submit. Confirm save succeeds, final destination order matches the visual order.
   - **Edit flow:** open an existing trip, reorder cities, swap destinations across positions, remove an inclusion, add an inclusion in each column. Submit. Confirm save + no React `key` warnings in the browser console.
   - **Validation:** try submitting with an empty required field (e.g. clear slug) — confirm the inline valibot error renders (proves `onChange: createOpenTripSchema` is live).
4. **Build:** `pnpm build` (optional but recommended — catches Next.js server-component edge cases `typecheck` misses).
5. **Log the decision:** add a `LOG.md` entry via the `save-log` skill — "Unify Open Trip create/update schema; PUT becomes full-replace; `_key` augmentation removed." (This is an API-contract change → LOG per project convention.)

---

## Context pointers (for the executing session)

- Per `AGENTS.md`, this is Full stack / cross-cutting → load `ARCHITECTURE` + `FRONTEND` + `BACKEND` + `DESIGN` from `.pi/project/`.
- Read `CODEBASE-DIRECTORY.md` before exploring (project rule).
- Reference sibling form to converge toward: `frontend/src/features/article/hooks/use-article-form.ts`.
- Files this PRD touches (6): the 6 listed in "Changes by file".
- The TanStack Form + valibot setup lives in `frontend/src/lib/form.tsx` (`createFormHook`, `useAppForm` base) and per-feature in `frontend/src/features/open-trip/components/form/use-app-form.ts` (adds `CitySelectField`/`DestinationSelectField`/`InclusionItemSelectField`). Do not touch either `useAppForm` definition — the change is in the hook's `validators.onChange` wiring, not the form factory.
- Backend validation pipeline: `sValidator` = `@hono/standard-validator` wrapping the valibot schema as a Standard Schema (see `backend/src/middlewares/validator-wrapper.ts`). Passing `createOpenTripSchema` to both POST and PUT needs no adapter change.