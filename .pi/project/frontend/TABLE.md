# Table Conventions

Guidelines for implementing admin CRUD list tables in feature modules.

## Scope

- Applies to all `frontend/src/features/<name>/components/table/` files.
- Covers admin list tables only. Public content tables (comparison tables, itinerary tables, etc.) stay under their own feature and are not governed by this convention.
- Uses the shadcn/ui `<Table>` primitive from `@/components/ui/table`.
- Does **not** use `@tanstack/react-table`.

## File Locations

```
features/<name>/
├── components/
│   └── table/
│       ├── index.tsx      # XTable component
│       └── row.tsx        # XTableRow component (always split)
├── hooks/
│   └── use-<name>-filters.ts   # nuqs filter hook
├── queries/
│   └── index.ts           # queryOptions / infiniteQueryOptions factory
├── mutations/
│   └── ...
├── pages/
│   └── <name>-list.page.tsx    # client coordinator page
└── stores/
    └── <name>-dialog.store.ts  # for dialog-based edit/delete
```

## Table Component (`table/index.tsx`)

### Base props

```ts
interface ArticleTableProps {
  query: GetArticlesQuery
}
```

`query` is the RPC-derived query object from `features/<name>/queries/index.ts`.

### Data loading

- Table is a **Suspense component**.
- Use `useSuspenseQuery` for non-paginated lists or `useSuspenseInfiniteQuery` for cursor-paginated lists.
- All query logic comes from `features/<name>/queries/index.ts`.

```tsx
"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableEmpty } from "@/components/table-empty"
import { getArticlesQueryOptions, type GetArticlesQuery } from "@/features/article/queries"
import { ArticleTableRow } from "./row"

interface ArticleTableProps {
  query: GetArticlesQuery
}

export function ArticleTable({ query }: ArticleTableProps) {
  const { data } = useSuspenseQuery(getArticlesQueryOptions(query))

  if (data.length === 0) {
    return (
      <TableEmpty
        icon={FileText}
        title="Belum ada artikel"
        description="Buat artikel pertama untuk mulai berbagi cerita."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Judul</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <ArticleTableRow key={item.id} item={item} />
        ))}
      </TableBody>
    </Table>
  )
}
```

Cursor pagination example:

```tsx
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { getArticlesQueryOptions, type GetArticlesQuery } from "@/features/article/queries"

export function ArticleTable({ query }: ArticleTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(getArticlesQueryOptions(query))

  const items = data.pages.flatMap((page) => page.items)

  if (items.length === 0) {
    return <Empty />
  }

  return (
    <>
      <Table>...</Table>
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant="outline"
        >
          {isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
        </Button>
      )}
    </>
  )
}
```

### Rules

- Define table headers inline in `table/index.tsx`. No `columns.ts` file.
- Render `<TableEmpty />` from `@/components/table-empty` when the list is empty.
- Do **not** handle loading internally. Loading is covered by the Suspense fallback on the page.
- Do **not** render create CTA, filter controls, or sort controls. Those live on the page or in `components/filter/`.
- For cursor-paginated lists, render the "Muat lebih banyak" button **below** the table wrapper, not inside `<TableFooter>`.

## Row Component (`table/row.tsx`)

### Base props

```ts
interface ArticleTableRowProps {
  item: GetArticlesResponse["data"]["items"][number]
}
```

### Responsibilities

- Render row cells.
- Own row-level actions: dropdown menu, edit/delete triggers, inline mutations.
- Use feature-specific dialog/sheet stores to open edit/delete dialogs.
- Use per-row Option 2 mutation hooks for inline mutations (id is available from the `item` prop).

```tsx
"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useArticleDialogStore } from "@/features/article/stores/article-dialog.store"
import { useDeleteArticleDialogStore } from "@/features/article/stores/delete-article-dialog.store"
import type { ArticleTableRowProps } from "./index"

export function ArticleTableRow({ item }: ArticleTableRowProps) {
  const { onOpen: openEdit } = useArticleDialogStore()
  const { onOpen: openDelete } = useDeleteArticleDialogStore()

  return (
    <TableRow>
      <TableCell>{item.title}</TableCell>
      <TableCell>{item.category?.name}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(item)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDelete(item.id)}>
              <Trash2 />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
```

### Rules

- Always split `row.tsx` from `table/index.tsx`, even for simple rows.
- Export `XTableRow` as a named export. No default export.
- Row receives only the entity object. No callbacks from parent.
- Default to `DropdownMenu` for actions. Inline buttons are allowed for a single primary action (e.g. "Lihat detail").
- Row only **triggers** delete/edit dialogs via stores. The actual dialog component is rendered once on the page.
- For edit actions, follow the form container decision:
  - Complex form → use `Link` to the edit page.
  - Simple form → open edit dialog via store.

## List Page (`pages/<name>-list.page.tsx`)

The list page is a **client coordinator**:

1. Calls `useXFilters()`.
2. Renders the filter toolbar (if any).
3. Renders the create CTA (if any).
4. Wraps `<XTable query={query} />` in `<Suspense>` with `<TableSkeleton />`.
5. Renders the delete/edit dialog components once.

```tsx
"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/table-skeleton"
import { ArticleFilter } from "@/features/article/components/filter"
import { ArticleTable } from "@/features/article/components/table"
import { DeleteArticleDialog } from "@/features/article/components/dialog/delete"
import { ArticleDialog } from "@/features/article/components/dialog"
import { useArticleFilters } from "@/features/article/hooks/use-article-filters"

export function ArticleListPage() {
  const { query } = useArticleFilters()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ArticleFilter />
        <Button>Tambah Artikel</Button>
      </div>

      <Suspense fallback={<TableSkeleton rowCount={10} columnCount={4} />}>
        <ArticleTable query={query} />
      </Suspense>

      <ArticleDialog />
      <DeleteArticleDialog />
    </div>
  )
}
```

### Error handling

Table query errors bubble up to the route-level `error.tsx` in the same App Router segment.

```tsx
// app/admin/dashboard/article/error.tsx
"use client"

import { ErrorComponent } from "@/components/error-component"

export default function ArticleError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorComponent error={error} reset={reset} />
}
```

Do **not** wrap `<Table />` in a client `<QueryBoundary>` unless the route already has one.

## Optional: Row Selection / Bulk Actions

When a feature needs bulk actions:

- Add a selection store at `features/<name>/stores/<name>-selection.store.ts`.
- Render a checkbox column in both table header and rows.
- Show a bulk action bar (delete, change status, etc.) when items are selected.
- Selection is opt-in. Do not add it unless the feature explicitly needs bulk actions.

## Decision Checklist

When adding a new admin list table:

- [ ] `features/<name>/components/table/index.tsx` exports `XTable`.
- [ ] `features/<name>/components/table/row.tsx` exports `XTableRow`.
- [ ] Table is a Suspense component consuming query options from `queries/index.ts`.
- [ ] Table receives only `query: GetXQuery` prop.
- [ ] Row receives only `item` prop and owns row actions.
- [ ] Loading handled by `<TableSkeleton />` Suspense fallback on the page.
- [ ] Empty state uses `<TableEmpty />` from `@/components/table-empty`.
- [ ] Errors bubble to route-level `error.tsx`.
- [ ] Delete/edit dialogs rendered once on page; rows trigger stores.
- [ ] Cursor pagination uses "Muat lebih banyak" button below the table wrapper.
- [ ] No sorting controls inside table headers (handled by filter toolbar).
- [ ] No create CTA inside table.
- [ ] Row actions default to `DropdownMenu`.
