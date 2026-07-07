# ARCHRON — Roadmap

Version: 2.0
Status: Live
Purpose: Single source of truth for all phases. Every status below was verified against the actual code in the repository on 2026-07-07 — not against the previous roadmap's claims.

---

## Repo Health

| Metric | Value | Notes |
|--------|-------|-------|
| Typecheck | ❌ 78 errors in 16 files | See "Typecheck Breakdown" below |
| Git status | ⚠️ Dirty | Hundreds of untracked files; both `.tsx`/`.jsx` pairs present |
| Ahead of origin | 57 commits | Not pushed |
| Packages | 10 | auth, database, editor, graph, knowledge-engine, renderer, search, shared, ui, vitest |
| Apps | 3 | web, studio, admin |
| Design specs | 10 | `docs/superpowers/specs/` — most executed |
| Implementation plans | 6 | `docs/superpowers/plans/` — all executed |

### Typecheck Breakdown (78 errors, 16 files — current run)

| Area | Error count | Root cause |
|------|-------------|------------|
| `apps/web` | ~12 | TS2307 — `@/components/*` path alias not resolving in tsconfig |
| `apps/studio` | ~10 | TS2307 — same path alias issue |
| `packages/renderer` | ~40 | TS18048 strict null checks in `parser/builder.ts` (~25), `parser/wikilink.ts` (~8), `resolver/knowledge.ts` (~6), plus unused imports |
| `packages/search` | ~12 | TS6133 unused imports + TS2322/TS2352 — `db.execute()` returns `Record<string, unknown>[]` but code treats results as typed rows |

> Note: Older per-package typecheck runs showed errors in `packages/database` (missing `integer` import) and `packages/ui` (`../lib/utils` + `react` declaration). These do not appear in the current workspace-wide run — likely fixed or masked by workspace tsconfig. Verify with `pnpm --filter @archron/database typecheck` and `pnpm --filter @archron/ui typecheck` separately if needed.

---

## Phase Map

```
Phase 0      Project Constitution          ✅
  │
  ▼
Phase 1      Information Architecture      ✅
  │
  ▼
Phase 2      Knowledge Object Model         ✅
  │
  ▼
Phase 3      Database Architecture          ✅
  │
  ▼
Phase 4      Rendering Engine               ⚠️
  │
  ▼
Phase 5      Design System                  ✅
  │
  ▼
Phase 6      Studio & Editor                ⚠️
  │
  ▼
Phase 7      Public Platform                🔌
  │
  ▼
Phase 8      Knowledge Graph                🔨
  │
  ▼
Phase 9      Community & Companion          ⚠️
  │
  ▼
Phase 10     Optimization & AI              📝
```

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete — docs + code verified, typecheck passes for this area |
| ⚠️ | Code exists but typecheck or lint fails |
| 🔌 | Routes/pages exist but use placeholder data, not wired to the database |
| 🔨 | Scaffold only — partial implementation, real gaps remain |
| 📋 | Docs complete, no code |
| 📝 | Docs exist, no code |
| ❌ | Not started |

---

## Phase 0 — Project Constitution

| Item | Status |
|------|--------|
| Docs | ✅ `PHASE-0.md` |
| Vision, Mission, Philosophy | ✅ Defined |
| Product Identity | ✅ 10 products listed |
| User Types | ✅ 7 roles defined |
| Technical Direction | ✅ Stack chosen |
| Anti-Goals | ✅ Documented |

**Dependencies:** None
**Blocks:** Everything
**Status: ✅ COMPLETE**

---

## Phase 1 — Information Architecture

| Item | Status |
|------|--------|
| Docs Folder | ✅ `information-architecture/` (10 files) |
| Content Hierarchy, Domains, Flow, Metadata, Navigation, Object Model, Relationships, Routing, Search, Taxonomy | ✅ All documented |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/shared` | ✅ Core types (knowledge, user, content, social) + utils (slug, string, date, validation) + constants. `ObjectQuery`, `ObjectResult`, `RelationQuery`, `RelationResult` live here. |

**Dependencies:** Phase 0 ✅
**Blocks:** Phase 2
**Status: ✅ COMPLETE**

---

## Phase 2 — Knowledge Object Model

| Item | Status |
|------|--------|
| Docs Folder | ✅ `domain/` (9 files) |
| Domain Glossary, Entities, Relations, Achievements, Permissions, Publishing, Rendering Rules, Search Rules, Workflows | ✅ All documented |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/knowledge-engine` | ✅ `KnowledgeEngine` class wired to real DB queries. `getObject`, `getRelations`, `getBacklinks`, `getTimeline`, `getRecommendations` all call `@archron/database` CRUD functions with in-memory cache. |

**Dependencies:** Phase 1 ✅, Phase 3 ✅
**Blocks:** Phase 7
**Status: ✅ COMPLETE**

---

## Phase 3 — Database Architecture

| Item | Status |
|------|--------|
| Docs Folder | ✅ `database/` (10 files) |
| Entity Model, Graph Storage, Indexing, Metadata, Migration Strategy, Reference Engine, Relationships, Schema Principles, Slug Engine, Versioning | ✅ All documented |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/database` | ✅ Full Drizzle schema (10+ tables, 9 enums) + `db.ts` client + CRUD layer |
| `db.ts` | ✅ Drizzle client via `postgres` package, exports `db` + `DB` type |
| `objects.ts` | ✅ `findObjectById`, `findObjectBySlug`, `listObjects`, `createObject`, `updateObject`, `softDeleteObject`, `publishObject`, `incrementViewCount` — with domain table joins |
| `relationships.ts` | ✅ `findRelations`, `createRelation`, `removeRelation`, `getGraphEdges`, `getGraphNodes` — auto-creates graph nodes |
| `users.ts` | ✅ `findUserByClerkId`, `findUserById`, `createUser`, `findOrCreateUser`, `updateProfile`, `updateRole` |
| `social.ts` | ✅ Collections, guides, achievements CRUD (6+3+1 functions) |
| `infrastructure.ts` | ✅ Slugs, aliases, revisions, references CRUD (9 functions) |
| `index.ts` | ✅ Re-exports all CRUD modules + `db` + `DB` |
| Tests | ✅ `__tests__/objects.test.ts`, `__tests__/relationships.test.ts` |

**Gaps:**
- ❌ Phase 8 additions not built — `reading_progress` table, `getSubgraph`, `getSharedConnections`, `getPrerequisites` (see `2026-07-07-phase3-db-graph-additions-design.md`)

**Dependencies:** Phase 2 ✅
**Blocks:** Phase 4, Phase 6, Phase 7, Phase 8
**Status: ✅ COMPLETE (core CRUD). Phase 8 graph additions pending.**

---

## Phase 4 — Rendering Engine

| Item | Status |
|------|--------|
| Docs Folder | ✅ `rendering/` (9 files) |
| Rendering Philosophy, Pipeline, Component Registry, Knowledge Resolver, Layout Engine, Performance, Plugin System, Responsive, SEO | ✅ All documented |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/renderer` | ⚠️ Custom MD parser, wiki-link parser, plugin pipeline, AST→React pipeline all present |
| `DEFAULT_COMPONENTS` | ✅ 22 components registered: `root`, `heading`, `paragraph`, `text`, `bold`, `italic`, `strikethrough`, `code_inline`, `code_block`, `blockquote`, `list`, `list_item`, `link`, `image`, `horizontal_rule`, `table`, `table_row`, `table_cell`, `wiki_link`, `callout`, `footnote`, `embed` |
| `registry/components.ts` | ✅ `createComponentRegistry()` returns defaults |
| `parser/builder.ts` | ⚠️ ~25 typecheck errors — strict null checks on `line` array access |
| `parser/wikilink.ts` | ⚠️ `PromiseSettledResult.value` access on rejected promises |
| `resolver/knowledge.ts` | ⚠️ Same `PromiseSettledResult` issue |
| `pipeline/orchestrator.ts` | ⚠️ Unused import |
| Tests | ✅ `__tests__/parser.test.ts` |

**Gaps:**
- ❌ 40 typecheck errors in renderer package must be fixed before pipeline is trustworthy

**Dependencies:** Phase 3 ✅
**Blocks:** Phase 5, Phase 7
**Status: ⚠️ FUNCTIONAL BUT TYPECHECK BROKEN — parser needs strict-null fix**

---

## Phase 5 — Design System

| Item | Status |
|------|--------|
| Docs Folder | ✅ `design/` (14 files) |
| Philosophy, Brand, Colors, Typography, Spacing, Components, Layout System, Motion, Interaction, Responsive, Accessibility, Cognitive Design, Visualization | ✅ All documented |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/ui` | ✅ Full component library |
| UI components (30+) | ✅ Button, Card, Badge, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Label, Dialog, DropdownMenu, Tooltip, Popover, Sheet, Command, Tabs, Pagination, Breadcrumbs, Tag, Divider, Chip, Skeleton, Progress, ScrollArea, Collapsible, TableOfContents, Avatar |
| Knowledge components (16) | ✅ ConceptCard, ThinkerCard, KnowledgeCard, SchoolCard, ArticleCard, BookCard, SymbolCard, TheoryCard, CompareView, ConceptLink, GlossaryCard, QuoteBlock, ReferenceDisplay, RelatedSection, ThinkerLink, TimelineEntry |
| Icon system | ✅ System icons (35+), Knowledge icons (8), Domain glyphs (12) |
| `apps/web` globals.css | ✅ Full design tokens: 17 colors, 5 fonts, 6 type sizes, containers, dark-first |
| Tests | ✅ `__tests__/button.test.tsx`, `__tests__/card.test.tsx` |

**Dependencies:** Phase 4 ✅
**Blocks:** Phase 6, Phase 7
**Status: ✅ COMPLETE**

---

## Phase 6 — Studio & Editor

| Item | Status |
|------|--------|
| Docs Folder | ✅ `studio/` (9 files) + `technical/` (9 files) |
| Studio Overview, Dashboard, Editor, Knowledge Manager, Publishing, Validation, Versioning, Workspace, Collaboration | ✅ All documented |

**Implementation:**

| Package / App | Status |
|---------------|--------|
| `@archron/editor` | ✅ TipTap-based: `editor-core`, `editor-layout`, `editor-toolbar`, `live-preview`, `slash-command-menu`, `status-bar`, `use-editor-state`, `wikilink-autocomplete` |
| `apps/studio` | ⚠️ Pages: dashboard, drafts/[id], objects, publish, workspace. Components: header, sidebar, dashboard/* (6), workspace/*. API: drafts, drafts/[id], objects, objects/[slug], publish. BUT path alias `@/components/*` fails typecheck. |
| `apps/admin` | ⚠️ Pages: dashboard, users/[id], moderation/[id], audit, configuration, content. Components: header, sidebar. API: audit, content, moderation, users, users/[id]. Same path alias issue. |

**Gaps:**
- ❌ `@/components/*` path alias not resolving in `apps/studio` and `apps/admin` tsconfig
- ❌ No tests for editor package

**Dependencies:** Phase 3 ✅, Phase 5 ✅
**Blocks:** Phase 9
**Status: ⚠️ CODE COMPLETE BUT STUDIO/ADMIN TYPECHECK BROKEN — fix path alias config**

---

## Phase 7 — Public Platform

| Item | Status |
|------|--------|
| Docs Folder | ✅ `public/` (10 files) |
| Home, Reading Layout, Search, Navigation, Explore, Timeline, Guides, Constellation, Companion, Performance | ✅ All documented |

**Implementation:**

| Package / App | Status |
|---------------|--------|
| `apps/web` layout | ✅ `ArchronClerkProvider` wired, Navbar + BottomNav, dark mode default, `lang="th"` |
| Routes (17 pages) | 🔌 All exist: `/`, `/[...slug]`, `/explore`, `/explore/[discipline]`, `/search`, `/timeline`, `/guides`, `/constellation`, `/companion`, `/(auth)/profile/[username]`, `/(auth)/settings`, `/(auth)/achievements`, `/(auth)/notifications`, `/(auth)/reviews`, `/(auth)/contributions`, `/(auth)/studio` |
| API routes (9) | ✅ chat, achievements, contributions, notifications, profile/[username], reviews, settings, studio, search/autocomplete |
| `@archron/search` | ✅ Full `SearchEngine`: tsvector search, facets, autocomplete, recordView, suggestRelated. BUT hardcoded to `'english'` config — no Thai support. |
| `@archron/renderer` | ⚠ Used for reading layout (but see Phase 4 typecheck issues) |
| Components | ✅ navbar, bottom-nav, search-bar, search-filters, autocomplete-popup, breadcrumb-bar, definition-bar, reading-sidebar, domain-grid, timeline-track, constellation-scene |

**Gaps:**
- ❌ `/[...slug]` page uses `PLACEHOLDER_BREADCRUMB`, `PLACEHOLDER_OBJECT`, `PLACEHOLDER_SIDEBAR` — does not call `KnowledgeEngine` or `@archron/database`. The `slug` param is discarded with `void slug`.
- ❌ Other pages likely also use placeholder data — need to wire to real DB
- ❌ Search hardcoded to `'english'` tsvector config — Thai search unsupported
- ❌ Path alias `@/components/*` fails typecheck in `apps/web`

**Dependencies:** Phase 2 ✅, Phase 3 ✅, Phase 4 ✅, Phase 5 ✅
**Blocks:** Phase 9
**Status: 🔌 ROUTES EXIST BUT NOT DATA-WIRED — placeholder data must be replaced with real KnowledgeEngine calls**

---

## Phase 8 — Knowledge Graph

| Item | Status |
|------|--------|
| Docs Folder | ✅ `knowledge-services/` (8 files) |
| Architecture, AI Companion, AI Principles, Graph Navigation, Learning Paths, Reading Memory, Recommendation, Semantic Search | ✅ All documented |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/graph` | 🔨 `createGraphScene` Canvas 2D renderer: nodes, edges, highlight, zoom/drag config, `NODE_TYPE_COLORS`. Real rendering but static layout — no force simulation. |
| `@archron/database` (graph tables) | ✅ `graph_nodes`, `graph_edges` tables defined |

**Gaps (all have a ready spec):**
- ❌ `reading_progress` table + CRUD — spec: `2026-07-07-phase3-db-graph-additions-design.md` Section 1-2
- ❌ `getSubgraph` (recursive N-hop CTE) — spec Section 3
- ❌ `getSharedConnections` (2-hop collaborative filter) — spec Section 3
- ❌ `getPrerequisites` (learning path traversal) — spec Section 3
- ❌ Three.js / WebGL rendering (dependency installed but unused)
- ❌ React component wrapper for graph
- ❌ Interactive graph navigation UI
- ❌ Recommendation engine logic
- ❌ Learning path generation logic
- ❌ Reading memory tracking hook
- ❌ AI Companion (10.6 — explicitly deferred)

**Dependencies:** Phase 3 ✅
**Blocks:** Phase 10
**Status: 🔨 CANVAS 2D ONLY — Phase 8 graph additions spec ready to execute**

---

## Phase 9 — Community & Companion

| Item | Status |
|------|--------|
| Docs Folder | ✅ `ecosystem/` (11 files) |
| Profiles, Identity, Membership, Roles, Contributions, Creator Studio, Achievements, Reputation, Review System, Moderation, Notifications | ✅ All documented |

**Implementation:**

| Package / App | Status |
|---------|--------|
| `@archron/auth` | ✅ Clerk integration: `getAuth`, `requireRole`, `clerkClient`, `ArchronClerkProvider`, `useRole`, `useAuth`, `useUser`, `useSession`, `authMiddleware` |
| `@archron/database` (social tables) | ✅ `collections`, `guides`, `achievements`, `reputation_events` |
| `apps/web` community pages | ⚠️ profile/[username], settings, achievements, notifications, reviews, contributions — all exist but path alias typecheck issue |
| `apps/web` community APIs | ✅ 9 API routes implemented |

**Gaps:**
- ❌ Path alias typecheck issue affects all community pages
- ❌ Reputation system logic not implemented (table exists, no business rules)
- ❌ No review workflow UI logic (pages exist, backend stubs)

**Dependencies:** Phase 6 ✅, Phase 7 ✅
**Blocks:** Nothing
**Status: ⚠️ AUTH + PAGES + APIs EXIST — path alias fix + reputation logic pending**

---

## Phase 10 — Optimization & AI

| Item | Status |
|------|--------|
| Docs Folder | ✅ `language/` + `technical/` |
| TypeScript, Turborepo, Three.js, Testing, shadcn/ui, Package Manager, MDX, Linting, HTML/CSS/Build, Architecture, API, Auth, Coding Standard, Database, Deployment, Folder Structure, Routing, Search | ✅ All documented |

**Implementation:**

| Item | Status |
|------|--------|
| Spec | 📋 `2026-07-07-phase10-group1-testing-gates-design.md` exists |
| Testing | ❌ Vitest configured per package, tests exist in database/renderer/ui/auth, but no CI gate |
| CI/CD | ❌ No pipeline |
| Deployment | ❌ Not configured |
| AI Companion | ❌ Not implemented (chat API route exists as placeholder) |
| Performance optimization | ❌ Not started |
| Bundle optimization | ❌ Not started |
| SEO | ❌ Not configured (metadata only on root layout) |
| Accessibility audit | ❌ Not done |
| Thai search support | ❌ `'english'` config unchanged in `@archron/search` |

**Dependencies:** Phase 8 ✅
**Blocks:** Nothing (final phase)
**Status: 📝 SPEC EXISTS, ZERO IMPLEMENTATION**

---

## Implementation Heat Map

```
Phase 0   Constitution              ████████████████████  ✅ COMPLETE
Phase 1   Info Architecture         ████████████████████  ✅ COMPLETE
Phase 2   Knowledge Object Model    ████████████████████  ✅ COMPLETE
Phase 3   Database Architecture     ████████████████████  ✅ COMPLETE (core)
Phase 4   Rendering Engine          ████████████████░░░░  ⚠️  Typecheck broken
Phase 5   Design System             ████████████████████  ✅ COMPLETE
Phase 6   Studio & Editor           ████████████████░░░░  ⚠️  Path alias broken
Phase 7   Public Platform           ██████████████░░░░░░  🔌  Placeholder data
Phase 8   Knowledge Graph           ██████░░░░░░░░░░░░░░  🔨  Canvas 2D only, spec ready
Phase 9   Community & Companion     ████████████████░░░░  ⚠️  Path alias broken
Phase 10  Optimization & AI         ░░░░░░░░░░░░░░░░░░░░  📝  Spec only
```

---

## Critical Path

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6 ──► Phase 7 ──► Phase 9
   ✅          ✅          ✅          ✅          ⚠️          ✅          ⚠️          🔌          ⚠️
                           │            │                                    │
                           │            └──► Phase 8 ──► Phase 10
                           │                🔨              📝
                           └──► Phase 7
                                🔌
```

---

## Top Priority Actions (Next)

The previous priorities (build CRUD, register components, expand UI) are all done. The real priorities now:

1. **Fix typecheck** — 78 errors across 16 files. Root causes:
   - Path alias `@/components/*` not resolving in `apps/web`, `apps/studio`, `apps/admin` → fix tsconfig `paths`
   - Renderer parser strict null checks → add null guards in `builder.ts`, `wikilink.ts`, `knowledge.ts`
   - Search `db.execute()` return typing → cast through `unknown` or use `as` properly

2. **Repo hygiene** — commit the hundreds of untracked files, resolve `.tsx`/`.jsx` duplication (the `.jsx` files look like transpiled output that should be gitignored, not committed), push the 57 unpushed commits.

3. **Wire Phase 7 pages to real data** — replace `PLACEHOLDER_*` constants in `/[...slug]/page.tsx` and other pages with real `KnowledgeEngine` / `@archron/database` calls. The infrastructure (routes, components, engine) is all there — just connect them.

4. **Phase 8 — execute `2026-07-07-phase3-db-graph-additions-design.md`** — add `reading_progress` table + CRUD, `getSubgraph`, `getSharedConnections`, `getPrerequisites`. Spec is complete and ready.

5. **Phase 10 — execute `2026-07-07-phase10-group1-testing-gates-design.md`** — CI pipeline, test gates, SEO, accessibility audit.

6. **Thai search support** — change `'english'` tsvector config in `@archron/search` to support Thai (requires `pg_trgm` or a Thai dictionary config).

---

## Executed Specs & Plans

| Spec / Plan | Status |
|-------------|--------|
| `2026-07-07-phase-3-crud-layer-design.md` + plan | ✅ Executed — CRUD layer complete |
| `2026-07-07-phase-4-rendering-components-design.md` + plan | ✅ Executed — 22 components registered |
| `2026-07-07-phase-5-design-system.md` + plan | ✅ Executed — UI library complete |
| `2026-07-07-phase-6a-editor.md` + plan | ✅ Executed — TipTap editor built |
| `2026-07-07-phase-6b-studio.md` + plan | ✅ Executed — studio app built |
| `2026-07-07-phase-6c-admin.md` + plan | ✅ Executed — admin app built |
| `2026-07-07-phase-7-public.md` (spec) | ✅ Executed — web app routes built |
| `2026-07-07-phase-9-community.md` (spec) | ✅ Executed — community pages + APIs built |
| `2026-07-07-phase3-db-graph-additions-design.md` | ❌ Not executed — Phase 8 prerequisite |
| `2026-07-07-phase10-group1-testing-gates-design.md` | ❌ Not executed — Phase 10 |

---

End of Roadmap v2.0
