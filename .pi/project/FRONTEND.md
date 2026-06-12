# Frontend Patterns

## Routing

- **Server Components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **Feature-based modules.** `frontend/src/features/<domain>/` owns components, hooks, types. Shared resources at `frontend/src/components/`, `frontend/src/hooks/`, `frontend/src/lib/`.
- **Route groups.** Public pages in `(public)` route group (Navbar/Footer in its layout). Admin in `admin/` route group with dashboard layout (sidebar + header).
- **Admin layout.** Dashboard pages wrapped in shadcn `SidebarProvider` + `AppSidebar` + `Header`/`MainPage` components.
- **No CMS yet.** Content still static/hardcoded for public pages. CMS decision deferred until admin modules built.

## Feature Module Structure

```
features/<name>/
├── components/       # Feature-specific components
├── dto/              # Valibot schemas + inferred types
│   └── <name>.schema.ts
├── hooks/            # Feature-specific hooks (if any)
├── mutations/        # TanStack Query mutation hooks
├── queries/          # queryOptions + infiniteQueryOptions factories
├── stores/           # Zustand UI stores
├── pages/            # Page components (imported by app/page.tsx)
├── lib/              # Feature-specific utilities
├── types.ts          # Feature types
├── index.ts          # Public barrel export
└── data.ts           # Feature static data (if any)
```

## DTO Convention

- Schemas in `dto/<name>.schema.ts`, named `<Name>Schema` (PascalCase).
- Inferred types exported alongside: `export type <Name>Input = v.InferOutput<typeof <Name>Schema>`.
- Components import schemas from `../dto/<name>.schema` — no Valibot in component files.
- One schema file per feature. Split to multiple only if schemas >150 lines.
- **Validation lib: Valibot.** Do not use Zod. Legacy auth schemas still on Zod (needs migration).

## Form Convention (TanStack Form)

- Use `useAppForm()` from `@/lib/form` — never raw `useForm` from TanStack.
- `useAppForm()` exposes `form.AppField`, `form.AppForm`, `field.TextField`, `form.SubmitButton`.
- Valibot validators passed via `validators: { onSubmit: <ValibotSchema> }` — TanStack Form supports Standard Schema natively.
- Do NOT use `@tanstack/valibot-form-adapter` — deprecated. Pass Valibot schema directly.
- Form error display via local `formError` state (set in `onSubmit` handler).
- Reference: `src/features/destination/hooks/use-destination-form.ts`.

## Query Factory Convention

Always use `queryOptions` for single-item fetches and `infiniteQueryOptions` for cursor-paginated lists. Always place factories in `features/<name>/queries/`. Factories are plain functions returning options objects.

```ts
// Pattern — single item (useQuery)
export const IMAGE_QUERY_KEY = "image" as const

export const getImageDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [IMAGE_QUERY_KEY, id],
    queryFn: async () => {
      const res = await $getImageDetail({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}

// Pattern — cursor-paginated list (useInfiniteQuery)
export const IMAGES_QUERY_KEY = "images" as const

export const getImagesQueryOptions = (query: GetImagesQuery = {}) => {
  return infiniteQueryOptions({
    queryKey: [IMAGES_QUERY_KEY, query],
    queryFn: async ({ pageParam }) => {
      const res = await $getImages({ query: { ...query, cursor: pageParam } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}
```

- `queryOptions` → use with `useQuery(...)`. `infiniteQueryOptions` → use with `useInfiniteQuery(...)`. Never mix.
- Always create `infiniteQueryOptions` for cursor-based pagination response data.
- Components call `useQuery(getImageDetailQueryOptions(id))` or `useInfiniteQuery(getImagesQueryOptions(query))` directly.
- Always check `json.success` from the unified response.
- Export query key as a const for cross-file reference (mutations need it for invalidation).

## Mutation Convention

Every mutation is a custom hook file in `features/<name>/mutations/<name>.mutation.ts`:

```ts
// Pattern
export const useUpdateImage = (id: string) => {
  return useMutation({
    mutationFn: async (input) => {
      const res = await $api({ param: { id }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)  // check unified response
      return json
    },
    onSuccess: (res) => {
      toast.success(res.message)       // user-facing message from API
    },
    onError: (err) => {
      toast.error(err.message)         // error toast on failure
    },
    onSettled: (_res, _error, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: [...] })  // invalidate in onSettled
    },
  })
}
```

Rules:
- Always destructure `res.json()`, check `json.success`, throw on failure.
- Show toast in `onSuccess` (message from API) and `onError` (error message).
- Invalidate related queries in `onSettled` via `context.client.invalidateQueries`.
- Export a const query key (e.g. `export const UPLOAD_MUTATION_KEY = ["upload-images"] as const`).

## Zustand Store Convention

- Use for **transient UI state only** (sheet open/close, dialog open/close, selected item IDs).
- Never store server data in zustand — use React Query for that.
- Place in `features/<name>/stores/<name>.store.ts`.
- Export store via `create<State>()((set) => ({ ... }))`.
- Components subscribe via selector: `useStore((s) => s.onOpen)`.
- Clean up on close: use `useEffect` to reset state when component closes.

```ts
// Pattern
import { create } from "zustand"

interface State {
  open: boolean
  selectedImageId: string | null
  onOpen: (imageId: string) => void
  onClose: () => void
}

export const useImageDetailSheetStore = create<State>()((set) => ({
  open: false,
  selectedImageId: null,
  onOpen: (imageId) => set({ selectedImageId: imageId, open: true }),
  onClose: () => {
    set({ open: false })
    setTimeout(() => set({ selectedImageId: null }), 300)
  },
}))
```

## Design System

- **Source:** `DESIGN.md` — Uber-inspired achromatic design system.
- **Fonts:** Inter (body / UberMoveText substitute), DM Sans (headings / UberMove substitute). Loaded via `next/font/google`.
- **Colors:** Strictly black + white + gray. Zero chroma in UI chrome. See `DESIGN.md §2`.
- **Radius:** Pill buttons (999px), standard cards (8px), comfortable containers (12px). No in-between.
- **Shadows:** `rgba(0,0,0,0.12)`–`0.16` only. Whisper-subtle. No colored shadows.
- **Typography:** Custom utilities (`text-display` thru `text-micro`) map to DESIGN.md §3 scale.
- **Components:** shadcn/ui overridden to match — full-pill buttons, achromatic palette, minimal borders.
