# Spec — Phase 10 Group 1: Testing Gates

Version: 1.0
Date: 2026-07-07
Status: Design
Phase: 10 (Group 1 of 4)
Scope: @archron/vitest + per-package vitest configs + smoke tests for all 9 packages

---

## Purpose

Phase 10 docs list "Testing: no tests written" and "CI/CD: no CI pipeline"
as the top two gaps. This spec closes the first one — the testing
infrastructure — so the CI/CD spec (Group 2) has something to run.

The docs reference `import base from "@archron/vitest"` but that package
does not exist. Zero test files exist in the repo. All 9 packages already
declare `vitest: "^4"` and a `"test": "vitest run"` script, but none of
them have a `vitest.config.ts`, and `@archron/ui` is the only package with
`@testing-library/react` installed.

This spec:
1. Creates the `@archron/vitest` config package.
2. Adds a `vitest.config.ts` to each of the 9 packages.
3. Writes 3-5 smoke tests per package (~13 test files, ~40-50 cases).
4. Wires Turbo caching for the `test` task.

Coverage thresholds from the docs (80-90% per package) are NOT enforced
yet — coverage is reported only. A follow-up spec flips the switch to
fail CI once coverage is actually high enough.

## Non-Goals

- CI/CD pipeline (GitHub Actions, Vercel build gates) — Group 2.
- Deployment (Vercel, env vars) — Group 2.
- SEO, accessibility audit — Group 2.
- Performance / bundle optimization — Group 3.
- Thai search support — Group 3.
- AI Companion — Group 4 (blocked by Phase 8).
- Hitting 80-90% coverage — smoke tests only this round.
- Test fixtures seeded from a real Postgres — all tests use mocked db.

## Approach

Infrastructure first, smoke tests second. Every package gets a working
vitest config and a small test suite that proves the package's primary
exports behave correctly. Deep coverage is a follow-up.

Pure-logic packages use `environment: "node"`. DOM-rendering packages
(`@archron/ui`, `@archron/editor`) use `environment: "jsdom"` with
`@testing-library/react` + `@testing-library/jest-dom` setup.

All db-dependent tests mock the Drizzle client — no Postgres connection
required to run the test suite. This matches the "No mocks by default,
mock only external IO" rule from `docs/language/testing.md`: the database
IS external IO.

## Architecture

```
archron/
├── packages/
│   ├── vitest/                     NEW package
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts            re-exports
│   │       ├── base-node.ts        environment: 'node'
│   │       ├── base-jsdom.ts       environment: 'jsdom'
│   │       └── setup-jsdom.ts      jest-dom matchers + cleanup
│   │
│   ├── shared/
│   │   ├── vitest.config.ts        NEW (extends baseNode)
│   │   └── src/__tests__/
│   │       ├── slug.test.ts        NEW
│   │       ├── string.test.ts      NEW
│   │       ├── date.test.ts        NEW
│   │       └── validation.test.ts  NEW
│   │
│   ├── database/
│   │   ├── vitest.config.ts        NEW (extends baseNode)
│   │   └── src/__tests__/
│   │       ├── objects.test.ts          NEW
│   │       ├── relationships.test.ts    NEW
│   │       └── reading-memory.test.ts   NEW
│   │
│   ├── renderer/
│   │   ├── vitest.config.ts        NEW (extends baseNode)
│   │   └── src/__tests__/
│   │       └── parser.test.ts      NEW
│   │
│   ├── search/
│   │   ├── vitest.config.ts        NEW (extends baseNode)
│   │   └── src/__tests__/
│   │       └── search.test.ts      NEW
│   │
│   ├── auth/
│   │   ├── vitest.config.ts        NEW (extends baseNode)
│   │   └── src/__tests__/
│   │       └── roles.test.ts       NEW
│   │
│   ├── knowledge-engine/
│   │   ├── vitest.config.ts        NEW (extends baseNode)
│   │   └── src/__tests__/
│   │       └── engine.test.ts      NEW
│   │
│   ├── graph/
│   │   ├── vitest.config.ts        NEW (extends baseJsdom — canvas)
│   │   └── src/__tests__/
│   │       └── graph.test.ts       NEW
│   │
│   ├── ui/
│   │   ├── vitest.config.ts        NEW (extends baseJsdom)
│   │   └── src/__tests__/
│   │       ├── button.test.tsx     NEW
│   │       └── card.test.tsx       NEW
│   │
│   └── editor/
│       ├── vitest.config.ts        NEW (extends baseJsdom)
│       └── src/__tests__/
│           └── slash-commands.test.tsx  NEW
│
└── turbo.json                      (test task inputs/outputs added)
```

---

## Section 1 — `@archron/vitest` package

### packages/vitest/package.json

```json
{
  "name": "@archron/vitest",
  "private": true,
  "type": "module",
  "exports": {
    ".": { "types": "./src/index.ts", "import": "./src/index.ts" },
    "./base-node": { "types": "./src/base-node.ts", "import": "./src/base-node.ts" },
    "./base-jsdom": { "types": "./src/base-jsdom.ts", "import": "./src/base-jsdom.ts" },
    "./setup-jsdom": { "types": "./src/setup-jsdom.ts", "import": "./src/setup-jsdom.ts" }
  },
  "dependencies": {
    "vitest": "^4",
    "@testing-library/react": "^16",
    "@testing-library/jest-dom": "^6",
    "jsdom": "^25"
  },
  "devDependencies": {
    "typescript": "^6.0"
  }
}
```

### packages/vitest/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### packages/vitest/src/base-node.ts

```ts
import { defineConfig } from "vitest/config"

export const baseNode = defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/index.ts", "src/**/*.d.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
})
```

### packages/vitest/src/base-jsdom.ts

```ts
import { defineConfig } from "vitest/config"

export const baseJsdom = defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["@archron/vitest/setup-jsdom"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/index.ts", "src/**/*.d.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
})
```

### packages/vitest/src/setup-jsdom.ts

```ts
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
  cleanup()
})
```

### packages/vitest/src/index.ts

```ts
export { baseNode } from "./base-node"
export { baseJsdom } from "./base-jsdom"
```

### Design notes

- Two named exports instead of a single `base` — each package imports the
  environment it needs explicitly.
- Coverage config lives in the base so every package reports the same way.
  No `thresholds` field — coverage is reported, not enforced (per the
  user's "report now, enforce later" decision).
- `setup-jsdom` is a separate export so `setupFiles` can reference it by
  string path.
- `jsdom` is a dependency of `@archron/vitest`, not of every UI package,
  so the DOM environment is provisioned once.

---

## Section 2 — Per-package vitest configs

### Pure-logic packages (extends baseNode)

Applies to: shared, database, search, auth, knowledge-engine, renderer,
graph. Each gets a `vitest.config.ts` at its package root.

Pattern (identical across all 7 pure-logic packages):

```ts
import { defineConfig, mergeConfig } from "vitest/config"
import { baseNode } from "@archron/vitest/base-node"

export default mergeConfig(baseNode, defineConfig({}))
```

`graph` extends `baseJsdom` instead of `baseNode` because
`createGraphScene` calls `document.createElement("canvas")`. The config
itself is the same shape, just a different base.

### DOM packages (extends baseJsdom)

Applies to: ui, editor.

```ts
import { defineConfig, mergeConfig } from "vitest/config"
import { baseJsdom } from "@archron/vitest/base-jsdom"

export default mergeConfig(baseJsdom, defineConfig({}))
```

### Packages that need package-specific overrides

If a package needs overrides (e.g. custom alias, different include
pattern), the mergeConfig call extends instead of being empty:

```ts
export default mergeConfig(baseNode, defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.ts", "tests/**/*.test.ts"],
  },
}))
```

None of the 9 packages in this spec need overrides — the base patterns
match their existing `src/` layout.

---

## Section 3 — Smoke test plan per package

3-5 tests per package. Files live at `packages/<name>/src/__tests__/`.
Every test follows Arrange-Act-Assert, uses describe/it, and mocks
external IO only (db, network).

### @archron/shared — packages/shared/src/__tests__/

**slug.test.ts**
- `slugify("The Shadow")` returns `"the-shadow"`
- `slugify("เงา")` returns a non-empty slug (Thai passes through)
- `slugify("")` throws or returns empty per contract
- `slugify` with 200-char input truncates to 200

**string.test.ts**
- `truncate("abcdef", 3)` returns `"abc..."`
- `truncate("abc", 5)` returns `"abc"` (no pad)
- `camelCase("hello world")` returns `"helloWorld"`

**date.test.ts**
- `formatDate(new Date("2026-07-07"))` returns expected string
- `formatDate` handles invalid date without throwing
- `relativeTime(now)` returns "just now" or similar

**validation.test.ts**
- `validateSlug("the-shadow")` returns true
- `validateSlug("The Shadow!")` returns false
- `validateEmail("a@b.com")` returns true
- `validateEmail("nope")` returns false

### @archron/database — packages/database/src/__tests__/

All tests mock `db` with `vi.fn()` chains. No Postgres connection.

**objects.test.ts**
- `findObjectBySlug(db, "shadow")` calls select().from().where().limit() and returns mapped row
- `findObjectBySlug(db, "missing")` returns null when no rows
- `createObject(db, {...})` calls tx.insert().values().returning() and returns mapped
- `publishObject(db, id)` sets status="published" + publishedAt

**relationships.test.ts**
- `findRelations(db, { objectId, direction: "outgoing" })` filters source_id only
- `createRelation(db, {...})` inserts rel, creates graph nodes if missing, inserts edge
- `removeRelation(db, id)` deletes edge then rel in transaction
- `getSubgraph(db, rootId, { maxDepth: 1 })` returns root + 1-hop neighbors (mocked execute)

**reading-memory.test.ts**
- `getProgress(db, userId, objectId)` returns row or null
- `upsertProgress(db, {...})` calls insert with onConflictDoUpdate
- `listContinueReading(db, userId, 6)` filters completed=false, orders by lastReadAt desc
- `markCompleted(db, userId, objectId)` sets completed=true, percentage=100

### @archron/renderer — packages/renderer/src/__tests__/

**parser.test.ts**
- `parse("# Hello")` returns AST with heading node "Hello"
- `parse("**bold**")` returns AST with strong node containing text "bold"
- `parse("[[Shadow]]")` returns AST with wiki-link node targeting "Shadow"
- `parse("")` returns empty document AST

### @archron/search — packages/search/src/__tests__/

**search.test.ts**
- `search(db, "shadow")` calls execute with tsvector query, returns ranked results
- `search(db, "เงา")` falls back to trigram query for Thai
- `search(db, "")` returns empty or trending fallback
- `search(db, "x", { types: ["concept"] })` applies type filter

### @archron/auth — packages/auth/src/__tests__/

**roles.test.ts**
- `getRole("member")` returns the member role definition
- `getRole("administrator")` returns admin role with all permissions
- `hasPermission("member", "read:objects")` returns true
- `hasPermission("member", "delete:objects")` returns false
- `roleHierarchy` lists roles in ascending order

### @archron/knowledge-engine — packages/knowledge-engine/src/__tests__/

**engine.test.ts**
- `getObject(db, "shadow", "concept")` returns object + concept domain data
- `getObject(db, "missing", "concept")` returns null
- `listByType(db, "thinker", { limit: 10 })` returns typed list
- `resolveWikiLink(db, "Shadow")` returns the concept object via slug/alias

### @archron/graph — packages/graph/src/__tests__/

**graph.test.ts** (uses jsdom for canvas)
- `createGraphScene(container, data)` mounts a canvas into container
- `render()` draws N circles for N nodes (verify canvas context calls)
- `highlight("n1")` sets isHighlighted on node n1 only
- `reset()` clears isHighlighted on all nodes
- `dispose()` removes all children from container

### @archron/ui — packages/ui/src/__tests__/

**button.test.tsx**
- renders with default props
- fires onClick when clicked
- applies variant className (e.g. "btn-primary")
- is disabled when `disabled` prop is set

**card.test.tsx**
- renders title and children
- renders description when provided
- does not render description slot when omitted

### @archron/editor — packages/editor/src/__tests__/

**slash-commands.test.tsx**
- `SlashCommandMenu` renders all commands on empty query
- typing "h" filters to commands starting with "h"
- selecting a command calls onInsert with the command
- clicking outside closes the menu

### Total

13 test files, ~40-50 cases.

---

## Section 4 — Turbo integration

### turbo.json

Update the existing `test` task:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*", "vitest.config.ts", "package.json", "tsconfig.json"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

`dependsOn: ["^build"]` ensures dependencies are built before tests run
(needed because some packages import from workspace dependencies).
`inputs` makes the cache invalidate on source or config change. `outputs`
declares the coverage folder as a cacheable artifact.

### Root package.json

No change. `"test": "turbo test"` already exists.

---

## Section 5 — Dependencies to install

Run from repo root:

```bash
pnpm install
```

After creating `packages/vitest/package.json` and updating each consumer
package's `package.json` to add `@archron/vitest: "workspace:*"` to
`devDependencies`, pnpm install resolves the workspace links.

### Per-package devDependencies to add

| Package | Add to devDependencies |
|---------|------------------------|
| shared | `@archron/vitest: workspace:*` |
| database | `@archron/vitest: workspace:*` |
| renderer | `@archron/vitest: workspace:*` |
| search | `@archron/vitest: workspace:*` |
| auth | `@archron/vitest: workspace:*` |
| knowledge-engine | `@archron/vitest: workspace:*` |
| graph | `@archron/vitest: workspace:*`, `jsdom: ^25` |
| ui | `@archron/vitest: workspace:*`, `jsdom: ^25`, `@testing-library/jest-dom: ^6` |
| editor | `@archron/vitest: workspace:*`, `jsdom: ^25`, `@testing-library/jest-dom: ^6` |

`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and
`jsdom` are already declared on `@archron/vitest` itself. Consumer
packages inherit them transitively through the workspace link, but
declaring `jsdom` and `@testing-library/jest-dom` on the DOM packages
makes the dependency explicit (in case `@archron/vitest` is later
replaced).

The 7 pure-logic packages already have `vitest: "^4"` in their
devDependencies — no change needed there.

---

## Section 6 — Coverage strategy (report now, enforce later)

`@archron/vitest` does NOT set `coverage.thresholds`. Coverage is computed
and reported via three reporters:

- `text` — printed to terminal on every run
- `html` — written to `coverage/index.html` per package
- `lcov` — written to `coverage/lcov.info` per package (CI-ready)

A follow-up spec (once coverage is actually high enough) adds
`thresholds` to the base config and flips CI to fail on miss.

---

## Section 7 — Verification

### Per package

```bash
pnpm --filter @archron/shared test
pnpm --filter @archron/database test
# ...one per package
```

### Repo-wide

```bash
pnpm test      # runs turbo test across all 9 packages
pnpm typecheck # confirms every vitest.config.ts compiles
pnpm lint      # confirms test files pass eslint
```

All three must exit 0. Coverage folders must exist under each package.

---

## Section 8 — Acceptance criteria

- [ ] `@archron/vitest` package exists under `packages/vitest/`
- [ ] `@archron/vitest` exports `baseNode`, `baseJsdom`, `setup-jsdom`
- [ ] All 9 packages have a `vitest.config.ts` extending the correct base
- [ ] `@archron/vitest: workspace:*` is a devDependency in all 9 packages
- [ ] `jsdom` declared on ui, editor, graph packages
- [ ] `turbo.json` `test` task has `inputs` and `outputs` configured
- [ ] Every package has at least one `*.test.ts` or `*.test.tsx` file
- [ ] `pnpm test` runs all 9 packages and exits 0
- [ ] `coverage/` folders generate under `packages/*/coverage/`
- [ ] `pnpm typecheck` clean across all packages
- [ ] `pnpm lint` clean across all packages
- [ ] No production code changes — tests + config only

---

## Section 9 — Risks

| Risk | Mitigation |
|------|------------|
| `@archron/vitest` exports TS files directly; vitest must resolve them | Vitest handles TS natively via esbuild; the workspace link resolves without a build step |
| `mergeConfig(baseNode, defineConfig({}))` looks redundant | It reserves the merge slot so package-specific overrides are additive, not replacing the base |
| `graph` tests need a canvas element in jsdom | jsdom provides `document.createElement("canvas")` returning a HTMLCanvasElement; `getContext("2d")` returns a stub. Tests assert call counts, not pixel output |
| Mocking the Drizzle `db` is verbose | Provide a `createMockDb()` helper in `@archron/vitest` (added if needed in a second pass) — for now, inline `vi.fn()` chains keep tests explicit |
| Turbo test cache returns stale coverage | `inputs` includes `vitest.config.ts` and `package.json`; any config change invalidates the cache |
| `@testing-library/jest-dom` matchers not loading | `setup-jsdom.ts` imports `@testing-library/jest-dom/vitest` which registers matchers on `expect` |

---

## Section 10 — Out of scope for this spec

- CI/CD pipeline — Group 2.
- Coverage threshold enforcement — follow-up spec.
- Deep test suites hitting 80-90% — follow-up spec.
- E2E tests (Playwright) — not in Phase 10 docs.
- Visual regression tests — not in Phase 10 docs.
- Load/performance tests — not in Phase 10 docs.
- `createMockDb()` helper — deferred to second pass if mock verbosity becomes a problem.

---

## Files touched

| File | Change |
|------|--------|
| `packages/vitest/package.json` | NEW |
| `packages/vitest/tsconfig.json` | NEW |
| `packages/vitest/src/index.ts` | NEW |
| `packages/vitest/src/base-node.ts` | NEW |
| `packages/vitest/src/base-jsdom.ts` | NEW |
| `packages/vitest/src/setup-jsdom.ts` | NEW |
| `packages/shared/vitest.config.ts` | NEW |
| `packages/shared/src/__tests__/slug.test.ts` | NEW |
| `packages/shared/src/__tests__/string.test.ts` | NEW |
| `packages/shared/src/__tests__/date.test.ts` | NEW |
| `packages/shared/src/__tests__/validation.test.ts` | NEW |
| `packages/database/vitest.config.ts` | NEW |
| `packages/database/src/__tests__/objects.test.ts` | NEW |
| `packages/database/src/__tests__/relationships.test.ts` | NEW |
| `packages/database/src/__tests__/reading-memory.test.ts` | NEW |
| `packages/renderer/vitest.config.ts` | NEW |
| `packages/renderer/src/__tests__/parser.test.ts` | NEW |
| `packages/search/vitest.config.ts` | NEW |
| `packages/search/src/__tests__/search.test.ts` | NEW |
| `packages/auth/vitest.config.ts` | NEW |
| `packages/auth/src/__tests__/roles.test.ts` | NEW |
| `packages/knowledge-engine/vitest.config.ts` | NEW |
| `packages/knowledge-engine/src/__tests__/engine.test.ts` | NEW |
| `packages/graph/vitest.config.ts` | NEW |
| `packages/graph/src/__tests__/graph.test.ts` | NEW |
| `packages/ui/vitest.config.ts` | NEW |
| `packages/ui/src/__tests__/button.test.tsx` | NEW |
| `packages/ui/src/__tests__/card.test.tsx` | NEW |
| `packages/editor/vitest.config.ts` | NEW |
| `packages/editor/src/__tests__/slash-commands.test.tsx` | NEW |
| `packages/shared/package.json` | + `@archron/vitest` devDep |
| `packages/database/package.json` | + `@archron/vitest` devDep |
| `packages/renderer/package.json` | + `@archron/vitest` devDep |
| `packages/search/package.json` | + `@archron/vitest` devDep |
| `packages/auth/package.json` | + `@archron/vitest` devDep |
| `packages/knowledge-engine/package.json` | + `@archron/vitest` devDep |
| `packages/graph/package.json` | + `@archron/vitest`, `jsdom` devDeps |
| `packages/ui/package.json` | + `@archron/vitest`, `jsdom`, `@testing-library/jest-dom` devDeps |
| `packages/editor/package.json` | + `@archron/vitest`, `jsdom`, `@testing-library/jest-dom` devDeps |
| `turbo.json` | `test` task inputs/outputs |
| `pnpm-lock.yaml` | regenerated by `pnpm install` |

No existing production code is refactored. All changes are additive
(new package, new config files, new test files, devDependency additions).

---

End of Spec.
