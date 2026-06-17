# Query & Mutation Conventions

Guidelines for implementing TanStack Query factories and mutation hooks in feature modules.

## Scope

- Applies to all `frontend/src/features/<name>/queries/` and `frontend/src/features/<name>/mutations/` files.
- Uses Hono RPC client (`apiClient`) from `@/lib/api-client`.
- Uses TanStack Query v5 (`queryOptions`, `infiniteQueryOptions`, `useMutation`).

## File Locations

```
features/<name>/
├── queries/
│   └── index.ts          # queryOptions + queryKeys factories
└── mutations/
    ├── create-<name>.mutation.ts
    ├── update-<name>.mutation.ts
    ├── delete-<name>.mutation.ts
    └── ...
```

Keep a single `queries/index.ts` until the module grows large enough to justify splitting.

## Query Conventions

### 1. Type Imports

Always import Hono inference types as type-only:

```ts
import type { InferRequestType, InferResponseType } from "hono"
```

### 2. Endpoint Consts

Assign every Hono endpoint to a const at the top of the file.

```ts
const $getArticles = apiClient.api.articles.$get
const $getArticle = apiClient.api.articles[":id"].$get
const $getDestinationGallery = apiClient.api.destinations[":id"].gallery.$get
```

Naming: `$<action><Entity>` or `$<action><EntityPlural>` for lists. For sub-resources, include the full path meaning, e.g. `$getDestinationGallery`.

### 3. Exported Types

Export response and query types derived from Hono RPC:

```ts
export type GetArticlesQuery = InferRequestType<typeof $getArticles>["query"]
export type GetArticlesResponse = InferResponseType<typeof $getArticles, 200>
export type GetArticleResponse = InferResponseType<typeof $getArticle, 200>
```

Only export derived entity aliases (e.g. `export type User = ...`) when no dedicated `features/<name>/types.ts` exists or when the alias is strictly query-related.

### 4. Query Key Factory

All query keys are created through a single `featureQueryKeys` object. Detail keys are nested under `all()`.

```ts
export const articleQueryKeys = {
  all: () => ["articles"] as const,
  list: (query: GetArticlesQuery) =>
    [...articleQueryKeys.all(), query] as const,
  detail: (id: string) =>
    [...articleQueryKeys.all(), "detail", id] as const,
}
```

Rules:
- Use `as const` on every key array.
- `all()` returns the feature root prefix.
- `list(...)` accepts the list filter/query object.
- `detail(id)` is nested under `all()` for broad invalidation.
- Sub-resources extend the detail key:
  ```ts
  gallery: (id: string) =>
    [...destinationQueryKeys.detail(id), "gallery"] as const
  ```

### 5. List Queries: `queryOptions` vs `infiniteQueryOptions`

Choose based on backend pagination type:

| Backend response | Factory |
|---|---|
| Cursor paginated (`{ data, nextCursor }`) | `infiniteQueryOptions` |
| Non-paginated full list | `queryOptions` |
| Offset paginated | `queryOptions` |

Cursor list example:

```ts
export const getArticlesQueryOptions = (query: GetArticlesQuery) => {
  return infiniteQueryOptions({
    queryKey: articleQueryKeys.list(query),
    queryFn: async ({ pageParam }) => {
      const res = await $getArticles({
        query: { ...query, cursor: pageParam },
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data as unknown as GetArticlesResponse["data"]
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}
```

The `as unknown as` cast is required because Hono RPC infers a union response type. Keep the cast only on list query data returns; detail queries can usually infer directly.

### 6. Detail Queries

```ts
export const getArticleQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: articleQueryKeys.detail(id),
    queryFn: async () => {
      const res = await $getArticle({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
}
```

### 7. Stale Time

Do **not** set `staleTime` on individual feature queries unless there is an explicit reason. The root `QueryClient` in `frontend/src/lib/query-client.ts` already defines a global default:

```ts
staleTime: 5 * 60 * 1000, // 5 minutes
```

Per-query overrides are acceptable only for reference data that changes rarely (e.g. categories cached at `60_000`). Document the reason in a comment when overriding.

### 8. Error Handling

All query functions must check `json.success` and throw on failure:

```ts
const json = await res.json()
if (!json.success) throw new Error(json.message)
return json.data
```

## Mutation Conventions

### 1. File Naming

```
create-<name>.mutation.ts
update-<name>.mutation.ts
delete-<name>.mutation.ts
update-gallery.mutation.ts
upload-images.mutation.ts
```

One mutation per file.

### 2. Mutation Key

Every mutation exports a `MUTATION_KEY` const and uses it.

- Global mutations (create, bulk upload, bulk delete): use base key only.
  ```ts
  export const CREATE_ARTICLE_MUTATION_KEY = ["create-article"] as const
  ```
- Entity-scoped mutations with the id passed to the hook (Option 2): include the id in the key.
  ```ts
  export const UPDATE_ARTICLE_MUTATION_KEY = ["update-article"] as const

  export const useUpdateArticle = (id: string) => {
    return useMutation({
      mutationKey: [...UPDATE_ARTICLE_MUTATION_KEY, id],
      // ...
    })
  }
  ```
- Entity-scoped mutations with the id passed to `mutate` (Option 1): use base key only because the id is not available at hook time.
  ```ts
  export const DELETE_ARTICLE_MUTATION_KEY = ["delete-article"] as const

  export const useDeleteArticle = () => {
    return useMutation({
      mutationKey: DELETE_ARTICLE_MUTATION_KEY,
      // ...
    })
  }
  ```

### 3. Hook Parameter Patterns

Entity-scoped mutations (update/delete) support two signatures. Choose based on where the mutation is consumed.

| Option | Use case | Hook signature | `mutate(...)` call |
|---|---|---|---|
| **Option 1** | List page | `useUpdateX = ()` | `mutate({ id, input })` |
| **Option 1** | List page | `useDeleteX = ()` | `mutate(id)` |
| **Option 2** | Detail page | `useUpdateX = (id: string)` | `mutate(input)` |
| **Option 2** | Detail page | `useDeleteX = (id: string)` | `mutate()` |

**Rule of thumb:**
- **List page** → Option 1. The id is only known when the user clicks a row action.
- **Detail page** → Option 2. The id is known as soon as the page/component mounts.

#### Option 1 — id passed to `mutate()` (list page)

Use this when the hook is consumed in a list/table where the id comes from the row being acted on. The mutation key is base-only because the id is not known at hook time.

Update example:

```ts
export const UPDATE_CATEGORY_MUTATION_KEY = ["update-category"] as const

export const useUpdateCategory = () => {
  return useMutation({
    mutationKey: UPDATE_CATEGORY_MUTATION_KEY,
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: InferRequestType<typeof $updateCategory>["json"]
    }) => {
      const res = await $updateCategory({ param: { id }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    // toast + invalidation ...
  })
}
```

Delete example:

```ts
export const DELETE_CATEGORY_MUTATION_KEY = ["delete-category"] as const

export const useDeleteCategory = () => {
  return useMutation({
    mutationKey: DELETE_CATEGORY_MUTATION_KEY,
    mutationFn: async (id: string) => {
      const res = await $deleteCategory({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    // toast + invalidation ...
  })
}
```

Trade-off: loading state is shared if the hook is called once at page level and passed into many row actions. To get per-row loading state, call the hook inside each row component.

#### Option 2 — id passed to hook (detail page)

Use this when the id is available at component mount (detail page, row-level component, or anywhere the id is in scope before the action).

Update example:

```ts
export const UPDATE_CATEGORY_MUTATION_KEY = ["update-category"] as const

export const useUpdateCategory = (id: string) => {
  return useMutation({
    mutationKey: [...UPDATE_CATEGORY_MUTATION_KEY, id],
    mutationFn: async (input: InferRequestType<typeof $updateCategory>["json"]) => {
      const res = await $updateCategory({ param: { id }, json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    // toast + invalidation ...
  })
}
```

Delete example:

```ts
export const DELETE_CATEGORY_MUTATION_KEY = ["delete-category"] as const

export const useDeleteCategory = (id: string) => {
  return useMutation({
    mutationKey: [...DELETE_CATEGORY_MUTATION_KEY, id],
    mutationFn: async () => {
      const res = await $deleteCategory({ param: { id } })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    // toast + invalidation ...
  })
}
```

Trade-off: natural per-entity loading state and per-entity mutation tracking. Requires id at hook call time.

### 4. Mutation Function

Use `InferRequestType` for input typing. Always check `json.success`.

```ts
const $createArticle = apiClient.api.articles.$post

export const useCreateArticle = () => {
  return useMutation({
    mutationKey: CREATE_ARTICLE_MUTATION_KEY,
    mutationFn: async (
      input: InferRequestType<typeof $createArticle>["json"]
    ) => {
      const res = await $createArticle({ json: input })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    // ...
  })
}
```

For form-data endpoints, use the `form` field:

```ts
const $uploadImage = apiClient.api.images.$post
type UploadImageInputType = InferRequestType<typeof $uploadImage>

export const useUploadImages = () => {
  return useMutation({
    mutationKey: UPLOAD_IMAGES_MUTATION_KEY,
    mutationFn: async (form: UploadImageInputType["form"]) => {
      const res = await $uploadImage({ form })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    // ...
  })
}
```

### 5. Toast Handling

Show toast in `onSuccess` and `onError`. Use the API message.

```ts
onSuccess: (res) => {
  toast.success(res.message)
},
onError: (err) => {
  toast.error(err.message)
},
```

Always use `err` as the error variable name, not `e`.

### 6. Invalidation

Invalidate related queries in `onSettled` using `context.client.invalidateQueries`.

Broad invalidation (after create/delete that affects lists):

```ts
onSettled: (_res, _err, _var, _result, context) => {
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.all(),
    exact: false,
  })
}
```

Update mutation — Option 2 (id from hook closure):

```ts
onSettled: (_res, _err, _var, _result, context) => {
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.detail(id),
    exact: true,
  })
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.all(),
    exact: false,
  })
}
```

Update mutation — Option 1 (id from `mutate` variables, `_var`):

```ts
onSettled: (_res, _err, vars, _result, context) => {
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.detail(vars.id),
    exact: true,
  })
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.all(),
    exact: false,
  })
}
```

Delete mutation — Option 2 (id from hook closure):

```ts
onSettled: (_res, _err, _var, _result, context) => {
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.detail(id),
    exact: true,
  })
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.all(),
    exact: false,
  })
}
```

Delete mutation — Option 1 (id from `mutate` variables, `_var`):

```ts
onSettled: (_res, _err, id, _result, context) => {
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.detail(id),
    exact: true,
  })
  context.client.invalidateQueries({
    queryKey: articleQueryKeys.all(),
    exact: false,
  })
}
```

Rules:
- Broad invalidation on `queryKeys.all()` uses `exact: false`.
- Specific entity invalidation on `queryKeys.detail(id)` or sub-resource keys uses `exact: true`.
- Order does not matter, but keep broad last for readability.

## Decision Checklist

When adding a new feature module:

- [ ] Single `queries/index.ts` with `featureQueryKeys` factory.
- [ ] Detail keys nested under `all()` with `as const`.
- [ ] List query uses `infiniteQueryOptions` for cursor pagination, `queryOptions` otherwise.
- [ ] No per-query `staleTime` unless justified.
- [ ] Every mutation exports a `MUTATION_KEY` const.
- [ ] Entity-scoped mutations include `id` in `mutationKey` when using Option 2 (id passed to hook). Option 1 uses base key only.
- [ ] `mutationFn` checks `json.success` and throws on failure.
- [ ] Toast in `onSuccess`/`onError` using API message.
- [ ] Invalidation in `onSettled` with correct `exact` flag.
- [ ] Type-only imports for Hono inference types.
