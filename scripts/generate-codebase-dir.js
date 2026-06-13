#!/usr/bin/env node
/**
 * generate-codebase-dir.js
 *
 * Scans the project filesystem and regenerates .pi/project/CODEBASE-DIRECTORY.md
 * Run: node scripts/generate-codebase-dir.js
 * Or: pnpm generate:dir
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOC = path.join(ROOT, ".pi/project/CODEBASE-DIRECTORY.md");

// ── Manual descriptions for well-known files ───────────
const DESCRIPTIONS = {
  // Frontend app
  "frontend/src/app/layout.tsx": "Root layout (fonts + html/body + RootProviders)",
  "frontend/src/app/globals.css": "Tailwind base styles",
  "frontend/src/app/not-found.tsx": "Global 404 page",
  "frontend/src/app/api/[[...route]]/route.ts": "Hono catch-all API handler",

  // Backend
  "backend/src/app.ts": "Hono app (CORS, auth, route registration)",
  "backend/src/app.type.ts": "AppContext (nullable) + AppAuthContext (guaranteed)",

  // Backend lib
  "backend/src/lib/db.ts": "PrismaClient with Neon adapter",
  "backend/src/lib/auth.ts": "Better Auth config (email+password, resend)",
  "backend/src/lib/r2.ts": "S3Client + upload/delete wrappers",
  "backend/src/lib/resend.ts": "Resend email client",
  "backend/src/lib/image-processing.ts": "Sharp resize + blurHash pipeline",
  "backend/src/lib/logger.ts": "Server logger",
  "backend/src/lib/paginate.ts": "Cursor pagination helper",
  "backend/src/lib/prisma-fragments.ts": "Prisma select fragments",
  "backend/src/lib/slug.ts": "Slug generation utility",

  // Backend utils/schemas
  "backend/src/utils/response.ts": "successResponse() / errorResponse() helpers",
  "backend/src/schemas/param.schema.ts": "Shared param schemas (paramIdSchema)",
  "backend/src/schemas/query.schema.ts": "Shared query schemas (querySchema)",

  // Frontend lib
  "frontend/src/lib/utils.ts": "cn() helper (clsx + tailwind-merge)",
  "frontend/src/lib/auth-client.ts": "Better Auth browser client",
  "frontend/src/lib/form.tsx": "useAppForm (TanStack Form factory)",
  "frontend/src/lib/query-client.ts": "React Query client instance",
  "frontend/src/lib/api-client.ts": "Hono RPC client",
  "frontend/src/lib/query-schema-parser.ts": "URL query schema parser",

  // Frontend utils
  "frontend/src/utils/format-file-size.ts": "File size formatter",
  "frontend/src/utils/date-to-string.type.ts": "Date-to-string type helper",

  // Frontend hooks
  "frontend/src/hooks/use-mobile.ts": "Mobile detection hook (used by sidebar)",
  "frontend/src/hooks/create-dialog-store.ts": "Zustand dialog/toggle store factory",
  "frontend/src/hooks/use-list-filters.ts": "Shared list filter hooks (nuqs)",

  // Frontend providers
  "frontend/src/providers/root.tsx": "RootProviders (TooltipProvider + QueryProvider + Toaster)",
  "frontend/src/providers/query-provider.tsx": "React Query provider (TanStack Query)",

  // Frontend proxy
  "frontend/src/proxy.ts": "Next.js auth middleware (route protection)",

  // Root config
  "frontend/.env": "Env vars (DATABASE_URL, BETTER_AUTH_SECRET, etc.)",
  "backend/.env": "Env vars (DATABASE_URL, RESEND_API_KEY, R2_*, etc.)",
  "frontend/components.json": "shadcn/ui config",

  // Prisma
  "backend/prisma/schema.prisma": "Prisma schema models",
  "backend/prisma/seed.ts": "Admin user seed",
};

// ── Helpers ─────────────────────────────────────────────
function ls(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).sort();
}

function isFile(dir, name) {
  return fs.statSync(path.join(dir, name)).isFile();
}

function desc(relPath) {
  return DESCRIPTIONS[relPath] || "";
}

// ── Tree builder ────────────────────────────────────────
function buildTree(dirRel, indent, skipDirs) {
  const dir = path.join(ROOT, dirRel);
  if (!fs.existsSync(dir)) return [];
  const entries = ls(dir);
  const lines = [];

  for (const entry of entries) {
    if (skipDirs && skipDirs.includes(entry)) continue;
    const full = path.join(dir, entry);
    const rel = dirRel + "/" + entry;
    const isDir = fs.statSync(full).isDirectory();
    const description = desc(rel);
    const suffix = description ? `  # ${description}` : "";

    if (isDir) {
      lines.push(`${indent}├── ${entry}/${suffix}`);
    } else {
      lines.push(`${indent}├── ${entry}${suffix}`);
    }
  }

  // Fix last entry: ├─ → └─
  if (lines.length > 0) {
    lines[lines.length - 1] = lines[lines.length - 1].replace("├──", "└──");
  }

  return lines;
}

// ── Build content ───────────────────────────────────────
const SKIP = ["node_modules", ".next", "dist", ".git", ".turbo", "generated"];

let out = "";
out += `# Codebase Directory\n\n`;
out += `Monorepo with two workspace packages: \`frontend/\` and \`backend/\`. Orchestrated via Turborepo.\n\n`;
out += `\`\`\`\n`;

// ── Frontend root config ────────────────────────────────
out += `frontend/                         # Next.js app (Next.js 16, App Router)\n`;
out += `├── package.json\n`;
out += `├── next.config.ts\n`;
out += `├── tsconfig.json\n`;
out += `├── components.json               # shadcn/ui config\n`;
out += `├── postcss.config.mjs\n`;
out += `├── eslint.config.mjs\n`;
out += `├── .env                          # Env vars (DATABASE_URL, BETTER_AUTH_SECRET, etc.)\n`;
out += `│\n`;
out += `└── src/\n`;

// ── Frontend src/app ────────────────────────────────────
out += `    ├── app/\n`;
out += `    │   ├── layout.tsx             # Root layout (fonts + html/body + RootProviders)\n`;
out += `    │   ├── globals.css            # Tailwind base styles\n`;
out += `    │   ├── not-found.tsx          # Global 404 page\n`;
out += `    │   │\n`;
out += `    │   ├── (public)/              # Public route group (Navbar + Footer)\n`;
out += `    │   │   ├── layout.tsx         # Public layout (Navbar + Footer)\n`;
out += `    │   │   ├── page.tsx           # Homepage\n`;

const publicRoutes = ["open-trip", "private-trip", "umrah", "destinations", "artikel", "about", "faq", "contact"];
for (const route of publicRoutes) {
  out += `    │   │   ├── ${route}/\n`;
}

out += `    │   │\n`;
out += `    │   ├── admin/                 # Admin route group (no Navbar/Footer)\n`;
out += `    │   │   ├── page.tsx           # Admin index (redirects to dashboard or login)\n`;
out += `    │   │   ├── loading.tsx        # Loading fallback for admin\n`;
out += `    │   │   ├── (auth)/            # Auth pages (centered layout)\n`;
out += `    │   │   │   ├── layout.tsx     # Centered auth layout\n`;
out += `    │   │   │   ├── login/         # Login page\n`;
out += `    │   │   │   ├── forgot-password/\n`;
out += `    │   │   │   └── reset-password/\n`;
out += `    │   │   └── dashboard/         # Admin dashboard (SidebarProvider layout)\n`;
out += `    │   │       ├── layout.tsx     # Admin dashboard layout (SidebarProvider + AppSidebar)\n`;
out += `    │   │       ├── page.tsx       # Dashboard home\n`;

const dashboardDirs = ls(`${ROOT}/frontend/src/app/admin/dashboard`).filter(
  (e) => ![".tsx"].includes(path.extname(e)) && e !== "layout.tsx" && e !== "page.tsx"
);
for (const d of dashboardDirs) {
  out += `    │   │       ├── ${d}/\n`;
}

out += `    │   │\n`;
out += `    │   └── api/\n`;
out += `    │       └── [[...route]]/\n`;
out += `    │           └── route.ts       # Hono catch-all API handler\n`;
out += `    │\n`;

// ── Frontend src/components ─────────────────────────────
out += `    ├── components/\n`;
out += `    │   ├── ui/                    # shadcn/ui (auto-generated) + shadcn-originated custom primitives\n`;

const uiFiles = ls(`${ROOT}/frontend/src/components/ui`);
for (const f of uiFiles) {
  out += `    │   │   ├── ${f}\n`;
}

out += `    │   │\n`;

// Root-level components (not ui/, not sidebar/)
const rootComps = ls(`${ROOT}/frontend/src/components`).filter(
  (e) => e !== "ui" && e !== "sidebar" && isFile(`${ROOT}/frontend/src/components`, e)
);
for (const f of rootComps) {
  const rel = "frontend/src/components/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

out += `    │   └── sidebar/               # Admin sidebar components\n`;
const sidebarFiles = ls(`${ROOT}/frontend/src/components/sidebar`);
for (const f of sidebarFiles) {
  out += `    │       ├── ${f}\n`;
}

out += `    │\n`;

// ── Frontend src/features ──────────────────────────────
out += `    ├── features/                  # Feature modules (domain-driven)\n`;

const FEATURES_DIR = `${ROOT}/frontend/src/features`;
const features = ls(FEATURES_DIR);

for (const feat of features) {
  const featDir = path.join(FEATURES_DIR, feat);
  const hasSubdirs = ["components", "hooks", "mutations", "queries", "query", "pages", "stores", "lib", "dto"].some(
    (sub) => fs.existsSync(path.join(featDir, sub))
  );
  const hasData = fs.existsSync(path.join(featDir, "data.ts"));
  const hasTypes = fs.existsSync(path.join(featDir, "types.ts"));
  const hasIndex = fs.existsSync(path.join(featDir, "index.ts"));
  const isSimple = !hasSubdirs;

  if (isSimple && !hasData && !hasTypes) {
    out += `    │   ├── ${feat}/\n`;
    continue;
  }

  out += `    │   ├── ${feat}/\n`;

  // Components
  if (fs.existsSync(path.join(featDir, "components"))) {
    const comps = ls(path.join(featDir, "components"));
    out += `    │   │   ├── components/\n`;
    for (const c of comps) {
      const cPath = path.join(featDir, "components", c);
      const isDir = fs.statSync(cPath).isDirectory();
      if (isDir) {
        out += `    │   │   │   ├── ${c}/\n`;
        const subFiles = ls(cPath);
        for (const sf of subFiles) {
          out += `    │   │   │   │   ├── ${sf}\n`;
        }
      } else {
        out += `    │   │   │   ├── ${c}\n`;
      }
    }
  }

  // Subdirs with files
  const subDirs = ["hooks", "dto", "mutations", "queries", "query", "pages", "stores", "lib"];
  for (const sub of subDirs) {
    const subPath = path.join(featDir, sub);
    if (fs.existsSync(subPath)) {
      const files = ls(subPath);
      if (files.length > 0) {
        out += `    │   │   ├── ${sub}/\n`;
        for (const f of files) {
          out += `    │   │   │   ├── ${f}\n`;
        }
      }
    }
  }

  // Standalone files
  if (hasData) out += `    │   │   ├── data.ts\n`;
  if (hasTypes) out += `    │   │   ├── types.ts\n`;
  if (hasIndex) out += `    │   │   └── index.ts\n`;
}

out += `    │\n`;

// ── Shared dirs ─────────────────────────────────────────
out += `    ├── providers/                 # React provider wrappers\n`;
const provFiles = ls(`${ROOT}/frontend/src/providers`);
for (const f of provFiles) {
  const rel = "frontend/src/providers/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

out += `    │\n`;
out += `    ├── hooks/                     # Shared custom hooks\n`;
const hookFiles = ls(`${ROOT}/frontend/src/hooks`);
for (const f of hookFiles) {
  const rel = "frontend/src/hooks/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

out += `    │\n`;
out += `    ├── lib/                       # Utilities\n`;
const libFiles = ls(`${ROOT}/frontend/src/lib`);
for (const f of libFiles) {
  const rel = "frontend/src/lib/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

if (fs.existsSync(`${ROOT}/frontend/src/utils`)) {
  out += `    │\n`;
  out += `    ├── utils/                     # Shared utility functions\n`;
  const utilFiles = ls(`${ROOT}/frontend/src/utils`);
  for (const f of utilFiles) {
    const rel = "frontend/src/utils/" + f;
    const d = desc(rel);
    const suffix = d ? `  # ${d}` : "";
    out += `    │   ├── ${f}${suffix}\n`;
  }
}

out += `    │\n`;

const typesDir = `${ROOT}/frontend/src/types`;
const typesEmpty = !fs.existsSync(typesDir) || ls(typesDir).length === 0;
out += `    ├── data/                      # Static data (testimonials only)\n`;
out += `    ├── types/                     # Shared TypeScript types${typesEmpty ? " (empty — types in features)" : ""}\n`;
out += `    └── proxy.ts                   # Next.js auth middleware (route protection)\n`;

// ── Backend ──────────────────────────────────────────────
out += `\nbackend/                           # Workspace package: API + DB + Auth\n`;
out += `├── package.json\n`;
out += `├── tsconfig.json                  # Extends root tsconfig.base.json\n`;
out += `├── prisma.config.ts               # Prisma 7 config (schema path, datasource URL, seed)\n`;
out += `├── .env                           # Env vars\n`;
out += `│\n`;
out += `├── prisma/\n`;
out += `│   ├── schema.prisma              # Prisma schema models\n`;
out += `│   ├── migrations/                # Migration files\n`;
out += `│   └── seed.ts                    # Admin user seed\n`;
out += `│\n`;
out += `└── src/\n`;
out += `    ├── app.ts                     # Hono app (CORS, auth, route registration)\n`;
out += `    ├── app.type.ts                # AppContext (nullable) + AppAuthContext (guaranteed)\n`;

// Middlewares
out += `    ├── middlewares/\n`;
const mwFiles = ls(`${ROOT}/backend/src/middlewares`);
for (const f of mwFiles) {
  const rel = "backend/src/middlewares/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

// Schemas
out += `    ├── schemas/\n`;
const schemaFiles = ls(`${ROOT}/backend/src/schemas`);
for (const f of schemaFiles) {
  const rel = "backend/src/schemas/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

// Utils
out += `    ├── utils/\n`;
const utilFiles = ls(`${ROOT}/backend/src/utils`);
for (const f of utilFiles) {
  const rel = "backend/src/utils/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   └── ${f}${suffix}\n`;
}

// Lib
out += `    ├── lib/\n`;
const beLib = ls(`${ROOT}/backend/src/lib`);
for (const f of beLib) {
  const rel = "backend/src/lib/" + f;
  const d = desc(rel);
  const suffix = d ? `  # ${d}` : "";
  out += `    │   ├── ${f}${suffix}\n`;
}

// Modules
out += `    └── modules/\n`;
const modules = ls(`${ROOT}/backend/src/modules`);
for (const mod of modules) {
  out += `        ├── ${mod}/\n`;
  const modFiles = ls(path.join(`${ROOT}/backend/src/modules`, mod));
  for (const f of modFiles) {
    out += `        │   ├── ${f}\n`;
  }
}

// ── Static sections ─────────────────────────────────────
out += `\`\`\`\n\n`;
out += `## Monorepo Structure\n\n`;
out += `- **Root:** Turbo (task orchestration), Prettier (shared config), tsconfig.base.json\n`;
out += `- **frontend/** — Next.js 16 app (imports \`"backend": "workspace:*"\`)\n`;
out += `- **backend/** — Hono + Prisma (generated Prisma client in \`src/generated/prisma/\`)\n`;
out += `- **Turborepo tasks:** \`db:generate\` → \`typecheck\` → \`lint\` → \`build\`\n`;
out += `- **Single \`.env\` per package** (frontend/.env for Next.js, backend/.env for Prisma)\n\n`;
out += `## Rules\n\n`;
out += `- \`components/ui/\` — shadcn/ui registry components + shadcn-originated custom primitives (empty, field, input-group, item). Don't hand-edit core shadcn files.\n`;
out += `- \`components/\` (root level) — shared custom components (hero-3, testimonials-columns-1, etc.). Not from shadcn, reused across 2+ features.\n`;
out += `- \`features/<x>/\` — feature owns its stuff. Import from features, not the other way.\n`;
out += `- \`data/\` — static TS data until CMS replaces it.\n`;
out += `- Pages in \`app/\` import from \`features/\` and \`components/\`. Pages stay thin.\n`;
out += `- \`backend/\` — workspace package imported via \`"backend": "workspace:*"\`. Hono app imported by API route.\n`;
out += `- \`frontend/src/proxy.ts\` — Next.js middleware matcher for \`/admin/:path*\`. Not a standard middleware file.\n`;

fs.writeFileSync(DOC, out, "utf8");
console.log(`✅ Generated ${DOC}`);