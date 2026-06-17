# PRD: Frontend User Management (Admin)

## Goal
Build the admin UI for managing users on top of the existing backend CRUD at `/api/users`.

## Backend contract (already implemented)
| Method | Path | Auth | Body / Query | Response |
|---|---|---|---|---|
| GET | `/api/users` | admin | `?sort=createdAt|name&order=asc|desc` | `{ success, data: UserDto[], message }` |
| POST | `/api/users` | admin | `{ name, email, password, role }` | `{ success, data: null, message }` 201 |
| PATCH | `/api/users/:id` | admin | `{ role }` | `{ success, data: null, message }` |
| DELETE | `/api/users/:id` | admin | — | `{ success, data: null, message }` |

`UserDto` shape: `{ id, name, email, avatar, role, createdAt }`

## Decisions
- Route: `/admin/dashboard/user`
- Feature folder: `frontend/src/features/user`
- One list page; create via dialog; role edit via inline `<Select>` in the table row; delete via a single `<AlertDialog>` controlled by a store.
- No empty state component (user list always has at least one admin).
- Only sort UI (sort by `createdAt` or `name`, asc/desc). No search / role filter.
- Current-user row disables delete and role edit, and shows the name as **Anda**.
- Role labels: `admin` → **Admin**, `author` → **Author**.
- Create form validators use the backend `createUserSchema` from `backend/modules/users/users.schema`.
- Sidebar adds a new **Admin** group with a **Pengguna** item, visible only to users with role `admin`.

## File structure

```
frontend/src/
  app/admin/dashboard/user/page.tsx
  components/sidebar/nav-admin.tsx          # new admin-only nav group
  components/sidebar/app-sidebar.tsx        # add NavAdmin
  features/user/
    pages/user-list.page.tsx
    components/
      dialog/index.tsx                      # UserDialog (create-only)
      dialog/delete.tsx                     # DeleteUserDialog (AlertDialog + store)
      table/index.tsx                       # UserTable
      table/row.tsx                         # UserTableRow
    hooks/use-user-filters.ts
    mutations/
      create-user.mutation.ts
      update-user-role.mutation.ts
      delete-user.mutation.ts
    queries/index.ts
    stores/
      user-dialog.store.ts                  # useUserDialogStore (create dialog)
      delete-user-dialog.store.ts           # useDeleteUserDialogStore
```

## Route page
`frontend/src/app/admin/dashboard/user/page.tsx`

Server component. Wraps the page with `MainPage`, `Header`, and `HeaderBreadcrumb`:
- Dashboard → Pengguna

Renders `<UserListPage />` directly (Suspense is inside the list page).

## List page
`frontend/src/features/user/pages/user-list.page.tsx` — client component.

Layout:
- Header row: sort `<Select>` on the left, "Tambah" button on the right (`ml-auto`) opening the create dialog.
- `<Suspense fallback={<TableSkeleton rowCount={5} columns={5} />}>`
  - `<UserTable />`
- `<UserDialog />`
- `<DeleteUserDialog />`

Sort options:
- `createdAt-desc` → Terbaru dibuat
- `createdAt-asc` → Terlama dibuat
- `name-asc` → Nama A-Z
- `name-desc` → Nama Z-A

## Table
`frontend/src/features/user/components/table/index.tsx` — client component.

- Fetches users with `useSuspenseQuery(getUsersQueryOptions(query))`.
- Fetches current session with `useSuspenseQuery(getAuthSessionQueryOptions())` to get `currentUserId`.
- Passes `currentUserId` and an `onDeleteClick(user)` callback to each `<UserTableRow />`.

Columns:
1. **Pengguna** — `<Avatar>` + name (or "Anda" for current user).
2. **Email**
3. **Role** — inline `<Select>` (disabled for current user).
4. **Dibuat** — `format(createdAt, "pp, PP", { locale: id })`.
5. **Aksi** — delete button (sr-only header), disabled for current user.

`frontend/src/features/user/components/table/row.tsx`

- Avatar fallback: first letter of `name`.
- Inline role `<Select>`:
  - Disabled when `user.id === currentUserId`.
  - Disabled while `updateUserRole` mutation is pending for this row.
  - Show a `Loader` spinner inline while pending.
  - On value change, call `updateUserRole.mutate({ id, role })`.
- Delete trigger:
  - `Button variant="destructive" size="sm"` with `Trash2` icon and label "Hapus".
  - Disabled when `user.id === currentUserId`.
  - On click, call `onOpen({ id, name })` from `useDeleteUserDialogStore`.

## Create dialog
`frontend/src/features/user/components/dialog/index.tsx` — client component.

- Controlled by `useUserDialogStore` (`createDialogStore<null>()`).
- Title: **Tambah Pengguna**
- Description: **Buat akun baru untuk admin atau author.**
- Form fields (in order):
  1. Nama
  2. Email
  3. Password (uses `field.PasswordField`)
  4. Role (uses `field.SelectField`; options Admin / Author)
- Default role: `author`.
- Validator: backend `createUserSchema`, validated `onChange`.
- Submit button loading label: **Membuat...**
- Prevent closing the dialog while `createUser` mutation is pending (ignore `onOpenChange` close and disable cancel button).
- On success: close dialog, invalidate users list, show toast from API message.
- On error: show toast with API message (e.g. duplicate email).

## Delete dialog
`frontend/src/features/user/components/dialog/delete.tsx` — client component.

- Controlled by `useDeleteUserDialogStore<{ id: string; name: string }>`.
- Uses `<AlertDialog>` primitive.
- Title: **Hapus Pengguna**
- Description: `Hapus pengguna "{name}"? Tindakan ini tidak dapat dibatalkan.`
- Footer:
  - Cancel button (disabled while deleting).
  - `ButtonLoading` destructive with label **Hapus**, loading label **Menghapus...**, `icon={Trash2}`.
- Prevent closing while `deleteUser` mutation is pending.
- On success: close dialog, invalidate users list, show toast.

## Filters hook
`frontend/src/features/user/hooks/use-user-filters.ts`

```ts
const [query, setQuery] = useQueryStates({
  sort: parseAsStringLiteral(["createdAt", "name"] as const).withDefault("createdAt"),
  order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
})

const { onSortOrderChange } = createFilterMethods(setQuery, ["createdAt", "name"])
```

Returns `{ query, methods: { onSortOrderChange } }`.

## Queries
`frontend/src/features/user/queries/index.ts`

```ts
const $getUsers = apiClient.api.users.$get
export type GetUsersResponse = InferResponseType<typeof $getUsers, 200>
export type User = NonNullable<GetUsersResponse["data"]>[number]

export const userQueryKeys = {
  all: () => ["users"] as const,
  list: (query: UserFilters) => [...userQueryKeys.all(), query] as const,
}

export const getUsersQueryOptions = (query: UserFilters) =>
  queryOptions({
    queryKey: userQueryKeys.list(query),
    queryFn: async () => {
      const res = await $getUsers({ query })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json.data
    },
  })
```

`UserFilters` type comes from `InferRequestType<typeof $getUsers>["query"]`.

## Mutations

### create-user.mutation.ts
```ts
const $createUser = apiClient.api.users.$post
export const CREATE_USER_MUTATION_KEY = ["create-user"] as const

export const useCreateUser = () =>
  useMutation({
    mutationKey: CREATE_USER_MUTATION_KEY,
    mutationFn: async (input: InferRequestType<typeof $createUser>["json"]) => { ... },
    onSuccess: (res) => toast.success(res.message),
    onError: (err) => toast.error(err.message),
    onSettled: (_, __, ___, ____, context) =>
      context.client.invalidateQueries({ queryKey: userQueryKeys.all(), exact: false }),
  })
```

### update-user-role.mutation.ts
```ts
const $updateUserRole = apiClient.api.users[":id"].$patch
export const UPDATE_USER_ROLE_MUTATION_KEY = ["update-user-role"] as const

export const useUpdateUserRole = () =>
  useMutation({
    mutationKey: UPDATE_USER_ROLE_MUTATION_KEY,
    mutationFn: async ({ id, input }: { id: string; input: InferRequestType<typeof $updateUserRole>["json"] }) => { ... },
    onSuccess: (res) => toast.success(res.message),
    onError: (err) => toast.error(err.message),
    onSettled: invalidate users list,
  })
```

### delete-user.mutation.ts
```ts
const $deleteUser = apiClient.api.users[":id"].$delete
export const DELETE_USER_MUTATION_KEY = ["delete-user"] as const

export const useDeleteUser = () =>
  useMutation({
    mutationKey: DELETE_USER_MUTATION_KEY,
    mutationFn: async (id: string) => { ... },
    onSuccess: (res) => toast.success(res.message),
    onError: (err) => toast.error(err.message),
    onSettled: invalidate users list,
  })
```

## Stores

`frontend/src/features/user/stores/user-dialog.store.ts`
```ts
export const useUserDialogStore = createDialogStore<null>()
```

`frontend/src/features/user/stores/delete-user-dialog.store.ts`
```ts
export const useDeleteUserDialogStore = createDialogStore<{ id: string; name: string }>()
```

## Sidebar

Add `frontend/src/components/sidebar/nav-admin.tsx`:

```tsx
"use client"

import { Users } from "lucide-react"
import { Suspense } from "react"

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { getAuthSessionQueryOptions } from "@/features/auth/query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSuspenseQuery } from "@tanstack/react-query"

function AdminMenu() {
  const { data } = useSuspenseQuery(getAuthSessionQueryOptions())
  const pathname = usePathname()

  if (data.user.role !== "admin") return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/dashboard/user")}>
            <Link href="/admin/dashboard/user">
              <Users />
              <span>Pengguna</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function NavAdmin() {
  return (
    <Suspense fallback={<NavSkeleton label="Admin" length={1} />}>
      <AdminMenu />
    </Suspense>
  )
}
```

Then import and render `<NavAdmin />` in `frontend/src/components/sidebar/app-sidebar.tsx` between `NavMain` and `NavUser`.

## Acceptance criteria
- [ ] Admin sees "Pengguna" sidebar item under Admin group.
- [ ] `/admin/dashboard/user` renders user table sorted by newest by default.
- [ ] "Tambah" button opens create dialog; submitting creates user and refreshes table.
- [ ] Duplicate email shows toast error and keeps dialog open.
- [ ] Role can be changed inline for any row except current user.
- [ ] Delete button opens AlertDialog; confirming deletes the user and refreshes table.
- [ ] Current user row cannot be deleted or role-edited, and name shows as "Anda".
- [ ] Sorting works via URL query params and updates table order.
- [ ] All mutations show toast success/error from API response.
- [ ] No `console.log`; no empty state component; Suspense lives inside the table list page.
