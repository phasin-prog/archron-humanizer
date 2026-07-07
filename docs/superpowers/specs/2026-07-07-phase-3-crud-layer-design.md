# Phase 3 + Phase 2 — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Implement Phase 3 (Database CRUD Layer) then Phase 2 (Knowledge Engine).

Phase 3 adds 6 files to `packages/database/src/`. Phase 2 modifies 1 file in `packages/knowledge-engine/src/`.

Every CRUD function is a **pure function** — takes `db` as first argument, returns `Promise`. No classes, no DI. Pattern matches existing `@archron/search` query builders.

---

## File 1: `packages/database/src/db.ts`

**Purpose:** Create and export the Drizzle database client.

**Design:**

```ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error("DATABASE_URL is required")

const queryClient = postgres(DATABASE_URL)
export const db = drizzle(queryClient, { schema })

export type DB = typeof db
```

Single instance, exported as `db`. The `DB` type is used by all CRUD functions for parameter typing.

**Dependencies:** `postgres`, `drizzle-orm/postgres-js` (already in package.json)

---

## File 2: `packages/database/src/objects.ts`

**Purpose:** CRUD for `objects` table + domain-specific joins (concepts, thinkers, books, articles, theories, schools, disciplines, symbols, quotes, timeline_events).

**Exports:**

| Function | Returns | Description |
|----------|---------|-------------|
| `findObjectById(db, id)` | `ObjectResult \| null` | Get full object + domain data by UUID. LEFT JOINs the domain table based on `objectType`. |
| `findObjectBySlug(db, slug)` | `ObjectResult \| null` | Same as above but by unique slug. |
| `listObjects(db, query)` | `ObjectResult[]` | Filtered, paginated listing. Supports: `types`, `status`, `language`, `difficulty`, `domains`, `tags`, `limit`, `offset`, `sort`, `includeDeleted`. |
| `createObject(db, data)` | `ObjectResult` | Insert into `objects` + the matching domain table in a transaction. |
| `updateObject(db, id, data)` | `ObjectResult` | Partial update. Merges domain table fields too. |
| `softDeleteObject(db, id)` | `void` | Sets `deletedAt`. |
| `publishObject(db, id)` | `ObjectResult` | Sets `status = "published"` + `publishedAt = now()`. |
| `incrementViewCount(db, id)` | `void` | `viewCount++`. |

**Domain join strategy:**

Given `objects.objectType = "concept"`, LEFT JOIN `concepts` table. Given `"thinker"`, LEFT JOIN `thinkers`. And so on. A single `findObject` function handles all 10 domain types via conditional joins.

**Type imports:** `ObjectResult`, `ObjectQuery` moved to `@archron/shared/src/types/knowledge.ts` to avoid circular dependency (database depends on shared, knowledge-engine depends on both).

---

## File 3: `packages/database/src/relationships.ts`

**Purpose:** CRUD for `relationships`, `graph_nodes`, `graph_edges`.

**Exports:**

| Function | Returns | Description |
|----------|---------|-------------|
| `findRelations(db, query)` | `RelationResult[]` | By source/target/type/direction. Joins with objects for `source`/`target` data. |
| `createRelation(db, data)` | `RelationResult` | Insert relationship. Auto-creates graph nodes if they don't exist, then creates edge. |
| `removeRelation(db, id)` | `void` | Delete relationship and related graph edge. |
| `getGraphEdges(db, objectId)` | `GraphEdge[]` | All graph edges for a node. |
| `getGraphNodes(db, query)` | `GraphNode[]` | Filtered graph nodes with pagination. |

**Type imports:** `RelationQuery`, `RelationResult` moved to `@archron/shared/src/types/knowledge.ts`.

---

## File 4: `packages/database/src/users.ts`

**Purpose:** CRUD for `users` + `profiles`.

**Exports:**

| Function | Returns | Description |
|----------|---------|-------------|
| `findUserByClerkId(db, clerkId)` | `User \| null` | Lookup by Clerk ID. |
| `findUserById(db, id)` | `UserWithProfile \| null` | User + JOIN profile. |
| `createUser(db, data)` | `User` | Insert into `users`. |
| `findOrCreateUser(db, clerkId, email)` | `User` | Upsert pattern for Clerk webhook. |
| `updateProfile(db, userId, data)` | `Profile` | Upsert profile fields. |
| `updateRole(db, userId, role)` | `void` | Update user role. |

---

## File 5: `packages/database/src/social.ts`

**Purpose:** CRUD for `collections`, `guides`, `achievements`, `reputation_events`.

**Exports:**

| Function | Returns | Description |
|----------|---------|-------------|
| `getCollection(db, id)` | `CollectionWithItems \| null` | Collection + items subquery. |
| `listCollections(db, ownerId)` | `Collection[]` | By owner. |
| `createCollection(db, data)` | `Collection` | Insert. |
| `addCollectionItem(db, data)` | `void` | Insert + increment itemCount. |
| `removeCollectionItem(db, id)` | `void` | Delete + decrement itemCount. |
| `getGuide(db, id)` | `GuideWithLessons \| null` | Guide + ordered lessons. |
| `listGuides(db, query)` | `Guide[]` | Filtered/paginated. |
| `createGuide(db, data)` | `Guide` | Insert. |
| `grantAchievement(db, userId, achievementCode)` | `void` | Upsert user_achievement + insert reputation_event. |

---

## File 6: `packages/database/src/infrastructure.ts`

**Purpose:** CRUD for `slugs`, `slug_redirects`, `aliases`, `revisions`, `references`, `object_references`.

**Exports:**

| Function | Returns | Description |
|----------|---------|-------------|
| `registerSlug(db, data)` | `Slug` | Insert new slug. |
| `findSlug(db, slug)` | `Slug \| null` | Resolve slug → object. |
| `redirectSlug(db, oldSlug, newSlug, objectId)` | `void` | Deactivate old + create redirect. |
| `addAlias(db, data)` | `Alias` | Insert alias. |
| `getAliases(db, objectId)` | `Alias[]` | All aliases for object. |
| `saveRevision(db, data)` | `Revision` | Insert revision snapshot. |
| `getRevisions(db, objectId)` | `Revision[]` | History for object. |
| `createReference(db, data)` | `Reference` | Insert academic reference. |
| `getReferences(db, objectId)` | `Reference[]` | References for object via JOIN object_references. |

---

## Phase 2: `packages/knowledge-engine/src/index.ts` (MODIFY)

**Changes:**

1. Replace `db: unknown` with `db: DB` (imported from `@archron/database`)
2. Import and use CRUD functions from `@archron/database`
3. Wire each method:

| Method | Implementation |
|--------|---------------|
| `getObject(slug)` | `findObjectBySlug(db, slug)` with cache |
| `getRelations(query)` | `findRelations(db, query)` with cache |
| `getBacklinks(objectId)` | `findRelations(db, { targetId: objectId, direction: "incoming" })` |
| `getTimeline(limit)` | `listObjects(db, { types: ["timeline_event"], sort: "recent", limit })` |
| `getRecommendations(objectId, limit)` | Get object's relations → get related objects → sort by backlinks/views → return top N |

No structural changes. All existing interfaces stay. Just fill in `// TODO` bodies.

---

## Multi-Agent Execution Plan

After spec approval, dispatch 6 agents in parallel:

| Agent | File | Complexity |
|-------|------|------------|
| Agent 1 | `db.ts` | Low (15 lines) |
| Agent 2 | `objects.ts` | High (domain joins, ~200 lines) |
| Agent 3 | `relationships.ts` + `users.ts` | Medium (~100 lines each) |
| Agent 4 | `social.ts` | Medium (~120 lines) |
| Agent 5 | `infrastructure.ts` | Medium (~120 lines) |
| Agent 6 | `knowledge-engine/src/index.ts` | Low (wiring only, ~80 lines) |

Agent 1 must finish first (types needed by others). Agents 2-5 run in parallel. Agent 6 runs after 2-5 complete.

---

## Dependencies

```
          schema/*.ts  (exists)
                │
          db.ts        (Agent 1)
                │
    ┌───────────┼───────────┐
    │     │     │     │     │
objects  rels  users social infra   (Agents 2-5 parallel)
    └───────────┼───────────┘
                │
        knowledge-engine   (Agent 6)
```

---

## Testing Strategy

Unit tests per file using Vitest with a test database:

- `objects.test.ts` — CRUD on `objects` + 1 domain table (concepts)
- `relationships.test.ts` — CRUD on relationships
- `users.test.ts` — User lookup + create
- `social.test.ts` — Collections + achievements
- `infrastructure.test.ts` — Slugs + revisions
- `knowledge-engine.test.ts` — All KE methods (mocked db)

---

## Acceptance Criteria

- [ ] `db.ts` exports typed `db` and `DB` type
- [ ] `objects.ts`: `findBySlug` resolves concept/thinker/book with domain data
- [ ] `objects.ts`: `createObject` inserts into both `objects` + domain table in transaction
- [ ] `relationships.ts`: `createRelation` auto-creates graph nodes
- [ ] `users.ts`: `findOrCreateUser` works for Clerk upsert
- [ ] `knowledge-engine`: `getObject(slug)` returns real data
- [ ] `knowledge-engine`: `getRelations` filters by type and direction
- [ ] All imports resolve, no circular deps
- [ ] `pnpm typecheck` passes on `@archron/database` and `@archron/knowledge-engine`
