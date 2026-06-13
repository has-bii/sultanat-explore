# Backend

## Architecture

### Module Structure

```
backend/src/
├── modules/<domain>/
│   ├── <domain>.route.ts      # Hono route handlers
│   ├── <domain>.service.ts    # Business logic (DB + external ops)
│   └── <domain>.schema.ts    # Valibot schemas (request validation)
├── middlewares/                # Shared Hono middleware
├── schemas/                   # Shared Valibot schemas (param, query)
├── utils/                     # Shared utilities (response.ts)
└── lib/                       # Shared utilities (db, auth, r2, etc.)
```

### Key Architectural Decisions

- **Backend modules.** `backend/src/modules/<domain>/` owns route, service, schema. Shared middleware at `backend/src/middlewares/`, shared schemas at `backend/src/schemas/`.
- **Auth split.** `AppContext` (nullable user/session) for public routes. `AppAuthContext` (guaranteed) for protected routes. `requireAuth` middleware narrows context type.
- **Workspace backend.** `backend/` is a local workspace package with its own `package.json`, Prisma schema, Hono app, auth config, and Resend integration.
- **API catch-all.** All API routes handled by `frontend/src/app/api/[[...route]]/route.ts` which imports the Hono app from `backend/`.
- **Route protection.** `frontend/src/proxy.ts` (Next.js config-based middleware) checks Better Auth session cookie before admin routes.

## Conventions

### File Naming

| Type | Pattern | Example |
|---|---|---|
| Route files | `<domain>.route.ts` | `image.route.ts` |
| Service files | `<domain>.service.ts` | `image.service.ts` |
| Schema files | `<domain>.schema.ts` | `image.schema.ts` |
| Middleware | `kebab-case.ts` | `require-auth.ts` |
| Shared schemas | `kebab-case.ts` | `pagination.ts` |
| Utilities | `kebab-case.ts` | `response.ts` |

### Import Aliases

- `backend/*` → `backend/src/*` (workspace package, accessible from frontend via monorepo workspace)

### Schema Convention

- Export Valibot schemas + inferred types (`v.InferOutput<typeof Schema>`).
- Named `<Name>Schema` (PascalCase).
- Import from `valibot` (as `import * as v from "valibot"`).

### Route Convention

- Chain routes with `.get()`, `.post()`, etc.
- Place public routes before `requireAuth`, auth-required routes after.
- Use `sValidator(target, schema)` for validation — never manual `safeParse`.
- Wrap success responses with `successResponse(data, msg)` from `backend/utils/response` — `c.json(successResponse(data, msg), status)`.
- `delete` routes return `c.json(successResponse(null, "..."), 200)` — 204 is avoided to keep the response envelope uniform.

### Service Convention

- One exported function per operation (uploadImage, listImages, etc.)
- Throw `HTTPException` with specific status + message.
- Keep R2/external ops and DB ops in same function (service owns full flow).

### API Response Format

All endpoints must return one of two shapes:

**Success (2xx):**
```ts
{ success: true, data: T, message: string }
```

**Error (4xx/5xx):**
```ts
{ success: false, data: null, message: string, error: any }
```

- Use `successResponse(data, message?)` in route handlers for success responses.
- Use `errorResponse(message, error?)` in `app.ts` global `onError` / `notFound` handlers (and thrown `HTTPException` automatically lands in `onError`).
- Every route handler returns data via `successResponse()` — never raw `c.json(data)`.
- `message` should be descriptive Indonesian (e.g. `"Foto berhasil dihapus"`).
- `error` field in error responses carries the technical cause or a user-safe string when cause is internal.

### Validation Convention

- **Validation lib: Valibot.** Do not use Zod.
- Use `sValidator(target, schema)` wrapper from `@hono/standard-validator` — auto-throws HTTPException(400) on failure.
- Never manual `safeParse` in routes.

### Auth Convention

- `AppContext` (nullable user/session) for public routes.
- `AppAuthContext` (guaranteed) for protected routes.
- `requireAuth` middleware narrows context type from `AppContext` → `AppAuthContext`.
- Session managed via Better Auth cookies.