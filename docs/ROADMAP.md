# ARCHRON — Roadmap

Version: 1.0
Status: Live
Purpose: Single source of truth for all phases. Every phase maps to docs, packages, apps, and implementation status.

---

## Phase Map

```
Phase 0      Project Constitution
  │
  ▼
Phase 1      Information Architecture
  │
  ▼
Phase 2      Knowledge Object Model
  │
  ▼
Phase 3      Database Architecture
  │
  ▼
Phase 4      Rendering Engine
  │
  ▼
Phase 5      Design System
  │
  ▼
Phase 6      Studio & Editor
  │
  ▼
Phase 7      Public Platform
  │
  ▼
Phase 8      Knowledge Graph
  │
  ▼
Phase 9      Community & Companion
  │
  ▼
Phase 10     Optimization & AI
```

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete (docs + code ready) |
| 📋 | Docs complete, code in progress |
| 🔨 | Docs complete, code scaffold only |
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
| Docs Folder | 📋 `information-architecture/` (10 files) |
| Content Hierarchy | 📋 `content-hierarchy.md` |
| Domains | 📋 `domains.md` |
| Information Flow | 📋 `information-flow.md` |
| Metadata | 📋 `metadata.md` |
| Navigation | 📋 `navigation.md` |
| Object Model | 📋 `object-model.md` |
| Relationships | 📋 `relationships.md` |
| Routing | 📋 `routing.md` |
| Search | 📋 `search.md` |
| Taxonomy | 📋 `taxonomy.md` |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/shared` | ✅ Core types (knowledge, user, content, social) + utils (slug, string, date, validation) + constants |

**Dependencies:** Phase 0 ✅
**Blocks:** Phase 2

**Status: 📋 DOCS COMPLETE — Implementation via @archron/shared (types live)**

---

## Phase 2 — Knowledge Object Model

| Item | Status |
|------|--------|
| Docs Folder | 📋 `domain/` (9 files) |
| Domain Glossary | 📋 `domain-glossary.md` |
| Entities | 📋 `entities.md` |
| Relations | 📋 `relationships.md` |
| Achievements | 📋 `achievements.md` |
| Permissions | 📋 `permissions.md` |
| Publishing | 📋 `publishing.md` |
| Rendering Rules | 📋 `rendering-rules.md` |
| Search Rules | 📋 `search-rules.md` |
| Workflows | 📋 `workflows.md` |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/knowledge-engine` | 🔨 Class scaffold, methods return empty |
| `@archron/shared` | ✅ 16 object types, 12 domain interfaces |

**Dependencies:** Phase 1 ✅
**Blocks:** Phase 3, Phase 7

**Status: 📋 DOCS COMPLETE — Knowledge Engine needs DB queries wired**

---

## Phase 3 — Database Architecture

| Item | Status |
|------|--------|
| Docs Folder | 📋 `database/` (10 files) |
| Entity Model | 📋 `entity-model.md` |
| Graph Storage | 📋 `graph-storage.md` |
| Indexing | 📋 `indexing.md` |
| Metadata | 📋 `metadata.md` |
| Migration Strategy | 📋 `migration-strategy.md` |
| Reference Engine | 📋 `reference-engine.md` |
| Relationships | 📋 `relationships.md` |
| Schema Principles | 📋 `schema-principles.md` |
| Slug Engine | 📋 `slug-engine.md` |
| Versioning | 📋 `versioning.md` |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/database` | 🔨 Full Drizzle schema (10+ tables, 9 enums), NO client config, NO CRUD |

**Gaps:**
- ❌ No `drizzle(db)` client instance configured
- ❌ No insert/select/update/delete functions
- ❌ No Postgres connection string handling

**Dependencies:** Phase 2 ✅
**Blocks:** Phase 4, Phase 6, Phase 7, Phase 8

**Status: 📋 DOCS COMPLETE — Schema done, CRUD layer missing**

---

## Phase 4 — Rendering Engine

| Item | Status |
|------|--------|
| Docs Folder | 📋 `rendering/` (9 files) |
| Rendering Philosophy | 📋 `rendering-philosophy.md` |
| Pipeline | 📋 `pipeline.md` |
| Component Registry | 📋 `component-registry.md` |
| Knowledge Resolver | 📋 `knowledge-resolver.md` |
| Layout Engine | 📋 `layout-engine.md` |
| Performance | 📋 `performance.md` |
| Plugin System | 📋 `plugin-system.md` |
| Responsive | 📋 `responsive.md` |
| SEO | 📋 `seo.md` |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/renderer` | ✅ Custom MD parser, wiki links, plugin pipeline, AST→React |
| `@archron/renderer` (DEFAULT_COMPONENTS) | ❌ Empty — no React components for 21 node types |

**Gaps:**
- ❌ No default React components registered for AST nodes
- ❌ Consumer must register all 21 node types manually

**Dependencies:** Phase 3 ✅
**Blocks:** Phase 5, Phase 7

**Status: 📋 DOCS COMPLETE — Renderer functional, needs default UI components**

---

## Phase 5 — Design System

| Item | Status |
|------|--------|
| Docs Folder | 📋 `design/` (13 files) |
| Philosophy | 📋 `philosophy.md` |
| Brand | 📋 `brand.md` |
| Colors | 📋 `colors.md` |
| Typography | 📋 `typography.md` |
| Spacing | 📋 `spacing.md` |
| Components | 📋 `components.md` |
| Layout System | 📋 `layout-system.md` |
| Motion | 📋 `motion.md` |
| Interaction | 📋 `interaction.md` |
| Responsive | 📋 `responsive.md` |
| Accessibility | 📋 `accessibility.md` |
| Cognitive Design | 📋 `cognitive-design.md` |
| Visualization | 📋 `visualization.md` |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/ui` | 🔨 5 components: Button, Card, Badge, ConceptCard, ThinkerCard |
| `apps/web` (globals.css) | ✅ Full design system: 17 colors, 5 fonts, 6 type sizes, containers, light/dark |

**Gaps:**
- ❌ Missing: Input, Select, Dialog, DropdownMenu, Tabs, Table, Avatar, Textarea, Skeleton, Tooltip, Sheet, Popover, Command, Accordion, Alert, Progress, Separator, ScrollArea, etc.

**Dependencies:** Phase 4 ✅
**Blocks:** Phase 6, Phase 7

**Status: 📋 DOCS COMPLETE — UI thin, needs full component library**

---

## Phase 6 — Studio & Editor

| Item | Status |
|------|--------|
| Docs Folder | 📋 `studio/` (9 files) |
| Studio Overview | 📋 `studio.md` |
| Dashboard | 📋 `dashboard.md` |
| Editor | 📋 `editor.md` |
| Knowledge Manager | 📋 `knowledge-manager.md` |
| Publishing | 📋 `publishing.md` |
| Validation | 📋 `validation.md` |
| Versioning | 📋 `versioning.md` |
| Workspace | 📋 `workspace.md` |
| Collaboration | 📋 `collaboration.md` |
| Tech Docs | 📋 `technical/` (9 files) |

**Implementation:**

| Package / App | Status |
|---------------|--------|
| `@archron/editor` | 🔨 Types + utils only (slash commands, validation, word count) |
| `apps/studio` | ❌ Empty (no src/) |
| `apps/admin` | ❌ Empty (no src/) |

**Gaps:**
- ❌ No Markdown/WYSIWYG editor component
- ❌ No Studio pages or layout
- ❌ No Admin pages or layout
- ❌ No TipTap/Slate/Monaco integration

**Dependencies:** Phase 3 ✅, Phase 5 ✅
**Blocks:** Phase 9

**Status: 📋 DOCS COMPLETE — Editor types defined, apps empty**

---

## Phase 7 — Public Platform

| Item | Status |
|------|--------|
| Docs Folder | 📋 `public/` (10 files) |
| Home | 📋 `home.md` |
| Reading Layout | 📋 `reading-layout.md` |
| Search | 📋 `search.md` |
| Navigation | 📋 `navigation.md` |
| Explore | 📋 `explore.md` |
| Timeline | 📋 `timeline.md` |
| Guides | 📋 `guides.md` |
| Constellation | 📋 `constellation.md` |
| Companion | 📋 `companion.md` |
| Performance | 📋 `performance.md` |

**Implementation:**

| Package / App | Status |
|---------------|--------|
| `apps/web` | 🔨 Homepage + design scaffold only |
| `@archron/search` | ✅ Full PostgreSQL tsvector search with facets, autocomplete |
| `@archron/renderer` | ✅ MD parsing + React rendering |
| `@archron/knowledge-engine` | 🔨 Data methods are stubs |

**Gaps:**
- ❌ No dynamic routes ([/slug], /concepts/[slug], /thinkers/[slug], etc.)
- ❌ No search UI
- ❌ No reading layout pages
- ❌ No guides, timeline, constellation pages
- ❌ No API routes
- ❌ `ArchronClerkProvider` not wired in layout
- ❌ Search config hardcoded to `'english'` (Thai support missing)

**Dependencies:** Phase 2 ✅, Phase 3 ✅, Phase 4 ✅, Phase 5 ✅
**Blocks:** Phase 9

**Status: 📋 DOCS COMPLETE — Web app is design-only scaffold**

---

## Phase 8 — Knowledge Graph

| Item | Status |
|------|--------|
| Docs Folder | 📋 `knowledge-services/` (8 files) |
| Architecture | 📋 `architecture.md` |
| AI Companion | 📋 `ai-companion.md` |
| AI Principles | 📋 `ai-principles.md` |
| Graph Navigation | 📋 `knowledge-graph-navigation.md` |
| Learning Paths | 📋 `learning-paths.md` |
| Reading Memory | 📋 `reading-memory.md` |
| Recommendation | 📋 `recommendation.md` |
| Semantic Search | 📋 `semantic-search.md` |

**Implementation:**

| Package | Status |
|---------|--------|
| `@archron/graph` | 🔨 Canvas 2D rendering (static), Three.js DEP UNUSED |
| `@archron/database` (graph tables) | ✅ `graph_nodes`, `graph_edges` tables defined |

**Gaps:**
- ❌ No force-directed layout algorithm
- ❌ No Three.js / WebGL rendering (dependency installed but unused)
- ❌ No React component wrapper
- ❌ No interactive graph navigation UI
- ❌ No recommendation engine
- ❌ No learning path generation
- ❌ No reading memory tracking

**Dependencies:** Phase 3 ✅
**Blocks:** Phase 10

**Status: 📋 DOCS COMPLETE — Graph is 2D static canvas only**

---

## Phase 9 — Community & Companion

| Item | Status |
|------|--------|
| Docs Folder | 📋 `ecosystem/` (11 files) |
| Profiles | 📋 `profiles.md` |
| Identity | 📋 `identity.md` |
| Membership | 📋 `membership.md` |
| Roles | 📋 `roles.md` |
| Contributions | 📋 `contributions.md` |
| Creator Studio | 📋 `creator-studio.md` |
| Achievements | 📋 `achievements.md` |
| Reputation | 📋 `reputation.md` |
| Review System | 📋 `review-system.md` |
| Moderation | 📋 `moderation.md` |
| Notifications | 📋 `notifications.md` |

**Implementation:**

| Package / App | Status |
|---------------|--------|
| `@archron/auth` | ✅ Clerk integration, role system, Thai locale |
| `@archron/database` (social tables) | ✅ `collections`, `guides`, `achievements`, `reputation_events` |

**Gaps:**
- ❌ No profile pages
- ❌ No member dashboard
- ❌ No contribution workflow UI
- ❌ No review system UI
- ❌ No notification UI
- ❌ No achievement UI
- ❌ No reputation system logic

**Dependencies:** Phase 6 ✅, Phase 7 ✅
**Blocks:** Nothing

**Status: 📋 DOCS COMPLETE — Auth functional, UI + workflows missing**

---

## Phase 10 — Optimization & AI

| Item | Status |
|------|--------|
| Docs Folder | 📋 `language/` + `technical/` |
| TypeScript Standards | 📋 `language/typescript.md` |
| Turborepo | 📋 `language/turborepo.md` |
| Three.js | 📋 `language/threejs.md` |
| Testing | 📋 `language/testing.md` |
| shadcn/ui | 📋 `language/shadcn.md` |
| Package Manager | 📋 `language/package-manager.md` |
| MDX | 📋 `language/mdx.md` |
| Linting | 📋 `language/linting.md` |
| HTML/CSS/Build | 📋 `language/` files |
| Architecture | 📋 `technical/architecture.md` |
| API | 📋 `technical/api.md` |
| Auth | 📋 `technical/auth.md` |
| Coding Standard | 📋 `technical/coding-standard.md` |
| Database | 📋 `technical/database.md` |
| Deployment | 📋 `technical/deployment.md` |
| Folder Structure | 📋 `technical/folder-structure.md` |
| Routing | 📋 `technical/routing.md` |
| Search | 📋 `technical/search.md` |

**Implementation:**

| Item | Status |
|------|--------|
| Testing | ❌ No tests written |
| CI/CD | ❌ No CI pipeline |
| Deployment | ❌ No deployment configured |
| AI Companion | ❌ Not implemented |
| Performance optimization | ❌ Not started |
| Bundle optimization | ❌ Not started |
| SEO | ❌ Not configured |
| Accessibility audit | ❌ Not done |
| Thai search support | ❌ `'english'` config unchanged |

**Dependencies:** Phase 8 ✅
**Blocks:** Nothing (final phase)

**Status: 📋 DOCS COMPLETE — Zero implementation**

---

## Implementation Heat Map

```
Phase 0   Constitution              ████████████████████  ✅ COMPLETE
Phase 1   Info Architecture         ██████████░░░░░░░░░░  📋 Docs + Shared types
Phase 2   Knowledge Object Model    ██████████░░░░░░░░░░  📋 Docs + Stub engine
Phase 3   Database Architecture     ████████████░░░░░░░░  📋 Docs + Schema only
Phase 4   Rendering Engine          ████████████████░░░░  📋 Docs + Functional
Phase 5   Design System             ████████░░░░░░░░░░░░  📋 Docs + Few components
Phase 6   Studio & Editor           ████░░░░░░░░░░░░░░░░  📋 Docs + Types only
Phase 7   Public Platform           ██████░░░░░░░░░░░░░░  📋 Docs + Search ready
Phase 8   Knowledge Graph           ██████░░░░░░░░░░░░░░  📋 Docs + 2D canvas
Phase 9   Community & Companion     ████░░░░░░░░░░░░░░░░  📋 Docs + Auth ready
Phase 10  Optimization & AI         ░░░░░░░░░░░░░░░░░░░░  📋 Docs only
```

## Critical Path

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6 ──► Phase 7 ──► Phase 9
                           │            │            │            │                        │
                           │            ├──► Phase 8 ──► Phase 10                       │
                           │            ├──► Phase 6                                    │
                           │            └──► Phase 7                                    │
                           └──► Phase 7                                                  │
```

## Top Priority Actions (Next)

1. **Phase 3** — Wire `drizzle(db)` client + CRUD layer in `@archron/database`
2. **Phase 2** — Implement `KnowledgeEngine` methods with actual DB queries
3. **Phase 7** — Build dynamic routes in `apps/web`
4. **Phase 5** — Expand `@archron/ui` with full component library
5. **Phase 4** — Register default React components in `@archron/renderer`

---

End of Roadmap
