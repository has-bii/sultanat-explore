# Plan: Admin Dashboard — Artikel & Kategori

## Context

Backend Article + Category modules fully implemented. Frontend has no admin CRUD for articles. Existing `features/articles/` is public-facing only (static data). Goal: build admin dashboard pages for article and category management.

---

## Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Content editor | TipTap (WYSIWYG) | Travel blog needs images in content. TipTap is standard for React rich text. |
| 2 | Scope | Admin only now | Public pages stay static. Wire to API later as separate task. |
| 3 | Category UX | Inline dialog | Single field (name). Full page overkill. |
| 4 | AuthorId | Server-side injection | Client doesn't send authorId. Server grabs from auth session. |
| 5 | Table columns | title, kategori, penulis, status, publishedAt | No thumbnail. Clean table. |
| 6 | Date field | Remove from Article model | Redundant — createdAt, updatedAt, publishedAt cover all needs. |
| 7 | Published filter | Select dropdown | "Semua" / "Published" / "Draft". Backend needs new query param. |
| 8 | Sort | Default createdAt desc | Options: "Terbaru dibuat" / "Terakhir diterbitkan" |
| 9 | Sidebar | Add Artikel (Overview + Kategori) | Top-level item with sub-items. |
| 10 | Existing public module | Keep `features/articles/` as-is | Don't touch. Create separate `features/article/` for admin. |

---

## Research: TipTap Editor

### Packages to Install

```bash
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image
```

- `@tiptap/react` — React integration (`useEditor`, `EditorContent`, `BubbleMenu`)
- `@tiptap/pm` — ProseMirror peer dependency
- `@tiptap/starter-kit` — Bundle of basic extensions (bold, italic, headings, lists, code, etc.)
- `@tiptap/extension-image` — Image node (NOT included in starter-kit)

### Key Patterns

#### Next.js SSR Setup

Must use `immediatelyRender: false` to avoid hydration mismatches in App Router:

```tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
    immediatelyRender: false, // Required for Next.js SSR
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
```

#### Image Extension

```tsx
import Image from '@tiptap/extension-image'

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true, // or use upload handler
    }),
  ],
})

// Insert image programmatically:
editor.chain().focus().setImage({ src: 'https://...' }).run()
```

#### Get/Set Content as JSON

```tsx
// Get content (store this in DB)
const json = editor.getJSON()

// Set content (load from DB)
const editor = useEditor({
  content: existingJsonContent, // pass JSON object directly
})
```

#### Toolbar (BubbleMenu)

Floating toolbar appears on text selection:

```tsx
import { BubbleMenu } from '@tiptap/react'

<BubbleMenu editor={editor}>
  <button onClick={() => editor.chain().focus().toggleBold().run()}
    className={editor.isActive('bold') ? 'active' : ''}>
    Bold
  </button>
  <button onClick={() => editor.chain().focus().toggleItalic().run()}>
    Italic
  </button>
</BubbleMenu>
```

#### Server-Side Rendering (for public pages later)

Use `@tiptap/html` to render JSON to HTML on server:

```bash
pnpm add @tiptap/html
```

```ts
import { generateHTML } from '@tiptap/html'

const html = generateHTML(jsonContent, [StarterKit, Image])
```

### Recommended Editor Component Structure

```
components/
├── tiptap-editor.tsx          # Main editor component (useClient)
├── tiptap-toolbar.tsx         # Static toolbar with formatting buttons
└── tiptap-editor-skeleton.tsx # Loading skeleton
```

Approach: **Static toolbar** (always visible above editor) + BubbleMenu (optional, on selection). Static toolbar is more predictable for admin forms.

Toolbar buttons: Bold, Italic, Heading (H2/H3), Bullet List, Ordered List, Image, Link, Blockquote, Code Block.

---

## Backend Changes

### 1. Remove `date` field from Article

**Prisma schema** — remove `date DateTime` line from Article model.

**Migration:**
```sql
ALTER TABLE "article" DROP COLUMN "date";
```

**Schema** (`article.schema.ts`):
- Remove `date` from `createArticleSchema`
- Remove `date` from `updateArticleSchema` (inherits via partial)

**Service** (`article.service.ts`):
- Remove `date: new Date(input.date)` from `createArticle`
- Remove `if (input.date !== undefined)` block from `updateArticle`

### 2. Remove `authorId` from client input

**Schema** (`article.schema.ts`):
- Remove `authorId` from `createArticleSchema`
- Remove `authorId` from `updateArticleSchema` (inherits via partial)

**Route** (`article.route.ts`):
- POST handler: inject `authorId` from `c.get("user").id` before passing to service
- PATCH handler: do NOT allow authorId changes (already removed from schema)

**Service** (`article.service.ts`):
- `createArticle`: accept `authorId` as separate param (from route), not from input
- Remove `authorId` check from `updateArticle` (author doesn't change)

### 3. Add `published` filter to list query

**Schema** (`article.schema.ts`):
- Add to `articleQuerySchema`:
  ```ts
  published: v.optional(v.boolean()),
  ```

**Service** (`article.service.ts`):
- In `listArticles`, change `published: true` to:
  ```ts
  ...(params.published !== undefined ? { published: params.published } : {}),
  ```
- When `published` is undefined, show all articles (admin needs this)

---

## Frontend Implementation

### File Structure

```
features/article/                        # Admin article module
├── queries/index.ts
├── mutations/
│   ├── create-article.mutation.ts
│   ├── update-article.mutation.ts
│   └── delete-article.mutation.ts
├── hooks/
│   ├── use-article-filters.ts
│   └── use-article-form.ts
├── components/
│   ├── article-table.tsx                # Suspense
│   ├── article-table-skeleton.tsx
│   ├── article-table-row.tsx
│   ├── article-filters.tsx
│   ├── article-form.tsx
│   ├── article-form-skeleton.tsx
│   └── delete-article-dialog.tsx
├── pages/
│   ├── article-list.page.tsx
│   ├── create-article.page.tsx
│   └── edit-article.page.tsx
└── types.ts

features/category/                       # Admin category module
├── queries/index.ts
├── mutations/
│   ├── create-category.mutation.ts
│   ├── update-category.mutation.ts
│   └── delete-category.mutation.ts
├── components/
│   ├── category-table.tsx
│   ├── category-table-skeleton.tsx
│   ├── category-dialog.tsx              # Create/edit dialog
│   └── delete-category-dialog.tsx
└── pages/
    └── category-list.page.tsx

components/
├── tiptap-editor.tsx                    # Shared TipTap editor
├── tiptap-toolbar.tsx                   # Toolbar buttons
└── tiptap-editor-skeleton.tsx

app/admin/dashboard/article/
├── page.tsx                             # List
├── create/page.tsx                      # Create
├── [id]/edit/page.tsx                   # Edit
└── category/page.tsx                    # Category list
```

### Queries (`features/article/queries/index.ts`)

```ts
// Pattern: follow destination/queries/index.ts
// Endpoints:
//   apiClient.api.articles.$get           — list (infiniteQueryOptions, cursor)
//   apiClient.api.articles[":id"].$get    — detail (queryOptions)

// Query keys:
//   articleQueryKeys.all()                — ["articles"]
//   articleQueryKeys.list(query)          — ["articles", query]
//   articleQueryKeys.detail(id)           — ["article", id]
```

### Mutations

Follow destination mutation pattern exactly:
- `$api` call → `res.json()` → check `success` → throw on failure
- `onSuccess`: `toast.success(res.message)`
- `onError`: `toast.error(err.message)`
- `onSettled`: invalidate `articleQueryKeys.all()`

### Article Form Fields

| Field | Component | Notes |
|-------|-----------|-------|
| Judul | `form.TextField` | Text input, required |
| Ringkasan | `form.AppField` + textarea | Textarea, required |
| Konten | `TiptapEditor` | Custom component, required |
| Gambar | `ImagePickerDialog` | Reuse existing, required |
| Kategori | Select dropdown | Optional. Fetch categories list. |
| Published | Switch toggle | Default false |

### Article Filters (`use-article-filters.ts`)

```ts
// URL params via nuqs:
//   search    — string
//   sort      — "createdAt" | "publishedAt" (default: "createdAt")
//   order     — "asc" | "desc" (default: "desc")
//   published — "all" | "true" | "false" (default: "all")
//   category  — string (category slug, optional)

// Use filterParsers + createFilterMethods from @/hooks/use-list-filters
// Add custom: publishedParser, categoryParser
```

### Category Dialog

Single `<input>` field for name. Valibot schema: `v.object({ name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)) })`.

- Create mode: dialog opens with empty form
- Edit mode: dialog opens with pre-filled name
- Uses `useAppForm()` + `createDialogStore<{ id: string; name: string }>()`

### Sidebar Update (`app-sidebar.tsx`)

Add to `navMain` array:

```ts
{
  title: "Artikel",
  url: "/admin/dashboard/article",
  icon: FileText,  // from lucide-react
  items: [
    { title: "Overview", url: "/admin/dashboard/article" },
    { title: "Kategori", url: "/admin/dashboard/article/category" },
  ],
}
```

---

## Execution Order

### Phase 1: Backend Fixes
1. Prisma schema — remove `date` field, run migration
2. `article.schema.ts` — remove `authorId` and `date`, add `published` filter
3. `article.route.ts` — inject authorId from session in POST
4. `article.service.ts` — remove date logic, update published filter logic

### Phase 2: Shared Components
5. Install TipTap packages
6. Create `components/tiptap-editor.tsx` + `tiptap-toolbar.tsx`

### Phase 3: Category Module
7. `features/category/queries/index.ts`
8. `features/category/mutations/` (create, update, delete)
9. `features/category/components/` (table, dialog, delete dialog)
10. `features/category/pages/category-list.page.tsx`
11. Route: `app/admin/dashboard/article/category/page.tsx`

### Phase 4: Article Module
12. `features/article/queries/index.ts`
13. `features/article/mutations/` (create, update, delete)
14. `features/article/hooks/` (filters, form)
15. `features/article/components/` (table, form, filters, delete dialog)
16. `features/article/pages/` (list, create, edit)
17. Routes: `app/admin/dashboard/article/` (page, create, [id]/edit)

### Phase 5: Sidebar & Wiring
18. Update `app-sidebar.tsx` with Artikel nav
19. Test full flow: create article → edit → delete → category CRUD

---

## Notes

- **Public pages deferred.** Existing `features/articles/` untouched. Wire to API in separate task.
- **TipTap content stored as JSON** in `content` field. Render to HTML on public pages later using `@tiptap/html`.
- **Image in TipTap:** Use existing image upload endpoint + `ImagePickerDialog` flow, or insert via URL. The `content` JSON stores image URLs inline.
- **Author auto-assigned.** No UI for author selection.
