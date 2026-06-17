# Form Conventions

Guidelines for implementing TanStack React Form in feature modules.

## Scope

- Applies to all `frontend/src/features/<name>/hooks/use-<name>-form.ts` and `features/<name>/components/form/index.tsx` files.
- Uses the `useAppForm()` factory from `@/lib/form`.
- Uses Valibot Standard Schema.

## File Locations

```
features/<name>/
├── hooks/
│   └── use-<name>-form.ts       # form setup: defaults, validators, cleanup
└── components/
    └── form/
        └── index.tsx            # presentational form component
```

The shared form factory lives in `frontend/src/lib/form.tsx`.

## Form Factory (`useAppForm`)

- Always import `useAppForm` from `@/lib/form`. Never use raw `useForm` from TanStack.
- Factory registers these field components: `TextField`, `TextareaField`, `PasswordField`, `ImagePickerField`, `SelectField`.
- Factory registers this form component: `SubmitButton`.
- Access them via `form.AppField`, `form.AppForm`, and `field.<RegisteredField>`.
- Do **not** use `@tanstack/valibot-form-adapter` — it is deprecated. Pass the Valibot schema directly; TanStack Form supports Standard Schema natively.

## Custom Form Hook Conventions

### Signature

```ts
interface Props {
  defaultValues?: Partial<T>
  onSubmit: (value: T) => Promise<void> | void
}
```

Optional context props (e.g. `destinationId`) may be added before `defaultValues`.

### Default values

Build a complete default-values object inside the hook. Use `??` fallbacks for every field.

```ts
const defaultValues: CreateArticleInput = {
  title: _defaultValues?.title ?? "",
  excerpt: _defaultValues?.excerpt ?? "",
  content: _defaultValues?.content ?? null,
  imageId: _defaultValues?.imageId ?? "",
  categoryId: _defaultValues?.categoryId ?? "_none",
  published: _defaultValues?.published ?? false,
}
```

### Validators

Always validate on change:

```ts
const form = useAppForm({
  defaultValues,
  validators: {
    onChange: createArticleSchema,
  },
  onSubmit: async ({ value }) => {
    await onSubmit(value)
  },
})
```

### Cleanup

Normalize or clean form values inside the hook's `onSubmit` before calling the prop `onSubmit`.

```ts
onSubmit: async ({ value }) => {
  const cleaned = {
    ...value,
    categoryId: value.categoryId === "_none" ? undefined : value.categoryId,
  }
  await onSubmit(cleaned)
}
```

## Form Component Conventions

### Base props

```ts
interface ArticleFormProps {
  form: ReturnType<typeof useArticleForm>
  mode: "create" | "edit"
  error: Error | null
  isPending: boolean
}
```

Add feature-specific props (e.g. `categories`, `destinations`) as needed.

### Submit wiring

```tsx
<form
  onSubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }}
>
  {/* fields */}

  <form.AppForm>
    <form.SubmitButton
      label={mode === "create" ? "Tambah" : "Perbarui"}
      pendingLabel="Menyimpan..."
      isDisabled={isPending}
      icon={mode === "create" ? Plus : Save}
    />
  </form.AppForm>
</form>
```

Rules:
- Always call `e.preventDefault()` and `e.stopPropagation()`.
- Always wrap `<form.SubmitButton>` with `<form.AppForm>`.

### Layout

- Wrap fields in `<FieldGroup>`.
- Use grid wrappers (`grid grid-cols-2 gap-4`) for side-by-side fields.
- Use `<form.AppField name="...">{(field) => <field.TextField ... />}</form.AppField>` for registered fields.

### Mode labels

| Mode | Submit label | Error title prefix |
|---|---|---|
| create | Tambah | Gagal menambahkan `<entity>` |
| edit | Perbarui | Gagal memperbarui `<entity>` |

Use `pendingLabel="Menyimpan..."` on submit buttons.

### Error display

All forms use `useMutation` for async submission. Pass the mutation `error` to the form component and render `<ErrorComponent>` at the top of `<FieldGroup>` (or at the top of the form layout for simple/auth forms).

Do not keep local `formError` state. If a submission target does not have a mutation hook yet, create one.

## Container Decision

Choose where the user interacts with the form based on complexity.

| Complexity | Container |
|---|---|
| Simple (few fields) | Dialog or Sheet |
| Complex (many fields, sections, media pickers) | Dedicated page |

On dedicated pages:
- **Create page** → include a "Batal" button inside the form actions.
- **Edit page** → put a "Kembali" button in the page header, not inside the form.

## Custom / Unregistered Fields

For fields not registered in `useAppForm` (checkbox, TipTap editor, array fields), use `<form.Field>` directly.

Compute invalid state:

```ts
const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
```

Wire `value`, `onChange`, and `onBlur` manually. Render `<FieldError errors={field.state.meta.errors} />` when invalid.

Array fields use `mode="array"` and expose `pushValue`, `removeValue`, etc.

## Schema Source

- Prefer importing the schema and input type from `backend/modules/<name>/<name>.schema.ts`.
- If the backend does not own the schema (e.g. auth via Better Auth, settings forms), define the schema locally in `features/<name>/dto/` or `features/<name>/types.ts`.

## Decision Checklist

When adding a new form:

- [ ] Hook at `features/<name>/hooks/use-<name>-form.ts`.
- [ ] Component at `features/<name>/components/form/index.tsx`.
- [ ] Uses `useAppForm` from `@/lib/form`.
- [ ] `validators: { onChange: schema }`.
- [ ] Builds full `defaultValues` with `??` fallbacks.
- [ ] Cleans/normalizes values in hook `onSubmit`.
- [ ] Component accepts `mode`, `error`, `isPending`.
- [ ] Submit wiring uses `e.preventDefault()` + `e.stopPropagation()`.
- [ ] Submit button wrapped in `<form.AppForm>`.
- [ ] Error display matches the mutation/error pattern.
- [ ] Schema imported from backend if available.
