# Spec A — Phase 3 DB Graph Additions

Version: 1.0
Date: 2026-07-07
Status: Design
Phase: 3 (DB layer prerequisite for Phase 8)
Scope: `@archron/database`

---

## Purpose

Phase 8 (Knowledge Graph) needs three DB capabilities that the current
`@archron/database` package does not provide:

1. A `reading_progress` table + CRUD for the Reading Memory service (10.4).
2. Multi-hop graph traversal (`getSubgraph`) for the Graph Navigation UI (10.5).
3. Shared-connection (`getSharedConnections`) and prerequisite
   (`getPrerequisites`) queries for the Recommendation (10.2) and
   Learning Path (10.3) engines.

The existing Phase 3 CRUD layer (objects, relationships, users, social,
infrastructure) is already complete. This spec only adds the three pieces
above. Nothing here touches the object/user/social CRUD that already ships.

## Non-Goals

- Phase 8 graph engine (force layout, Three.js, React wrapper) — Spec B.
- Recommendation engine, learning path engine, reading memory hook — Spec B.
- AI Companion (10.6) — explicitly out of Phase 8 scope.
- Semantic Search (10.1) — already ships in `@archron/search`.
- Search history (30-day) — belongs to Phase 7 search, not Phase 8.
- Modifying existing CRUD signatures — additive only.

## Approach

Hybrid, matching the existing codebase pattern:

- Simple queries → Drizzle ORM (`objects.ts`, `social.ts` pattern).
- Complex graph queries (recursive CTE, 2-hop joins) → raw SQL via `sql`
  template (`relationships.ts` already uses `sql` for OR conditions).

No new PLpgSQL functions. No new tables except `reading_progress`. No
changes to `graph_nodes`/`graph_edges` (those remain a layout cache, not a
query source).

## Architecture

```
@archron/database
├── src/schema/social.ts          (+ readingProgress table)
├── src/schema/index.ts           (re-exports, no change needed)
├── src/reading-memory.ts         (NEW — CRUD for reading_progress)
├── src/relationships.ts          (+ getSubgraph, getSharedConnections,
│                                  + getPrerequisites, + types)
├── src/index.ts                  (+ export * from "./reading-memory")
└── drizzle/<timestamp>_reading_progress.sql  (generated migration)
```

---

## Section 1 — Schema: `reading_progress` table

Add to `packages/database/src/schema/social.ts`:

```ts
import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, real, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { objects, users } from "./core"

// ...existing tables (collections, collectionItems, guides, guideLessons,
//    achievements, userAchievements, reputationEvents) unchanged...

export const readingProgress = pgTable(
  "reading_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
    objectType: varchar("object_type", { length: 50 }).notNull(),
    scrollPosition: real("scroll_position").default(0).notNull(),  // 0.0–1.0
    percentage: integer("percentage").default(0).notNull(),         // 0–100
    completed: boolean("completed").default(false).notNull(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }).default(sql`now()`).notNull(),
    device: varchar("device", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
  },
  (table) => ({
    userObjectUnq: uniqueIndex("reading_progress_user_object_unq")
      .on(table.userId, table.objectId),
    userLastReadIdx: uniqueIndex("reading_progress_user_last_read_idx")
      .on(table.userId, table.lastReadAt),
  }),
)
```

### Design notes

- `scrollPosition` (0.0–1.0) + `percentage` (0–100) per `reading-memory.md`.
- Unique index on `(userId, objectId)` → upsert on conflict for cross-device
  sync. Second index on `(userId, lastReadAt)` backs the "continue reading"
  query.
- 90-day reading history = a filtered query on this same table
  (`lastReadAt > now() - interval '90 days'`). No separate log table —
  the row IS the latest state; history is a view.
- Search history (30-day) stays out of scope — belongs to Phase 7 search.
- No `onDelete: "set null"` — cascade is correct: if the object or user is
  deleted, the progress row has no meaning.

### Migration

Run `pnpm db:generate` from `packages/database`. Drizzle Kit produces a
new SQL migration under `drizzle/` containing the `CREATE TABLE` and two
`CREATE UNIQUE INDEX` statements. Commit the generated file.

---

## Section 2 — `reading-memory.ts` CRUD module

New file `packages/database/src/reading-memory.ts`:

```ts
import { eq, and, desc, gt, sql, sql as drizzleSql } from "drizzle-orm"
import type { DB } from "./db"
import { readingProgress } from "./schema/social"

export type ReadingProgress = typeof readingProgress.$inferSelect

export interface UpsertProgressData {
  userId: string
  objectId: string
  objectType: string
  scrollPosition?: number
  percentage?: number
  completed?: boolean
  device?: string
}

export async function getProgress(
  db: DB,
  userId: string,
  objectId: string,
): Promise<ReadingProgress | null> {
  const [row] = await db
    .select()
    .from(readingProgress)
    .where(
      and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.objectId, objectId),
      ),
    )
    .limit(1)
  return row ?? null
}

export async function upsertProgress(
  db: DB,
  data: UpsertProgressData,
): Promise<ReadingProgress> {
  const [row] = await db
    .insert(readingProgress)
    .values({
      userId: data.userId,
      objectId: data.objectId,
      objectType: data.objectType,
      scrollPosition: data.scrollPosition ?? 0,
      percentage: data.percentage ?? 0,
      completed: data.completed ?? false,
      device: data.device,
    })
    .onConflictDoUpdate({
      target: [readingProgress.userId, readingProgress.objectId],
      set: {
        scrollPosition: data.scrollPosition ?? sql`reading_progress.scroll_position`,
        percentage: data.percentage ?? sql`reading_progress.percentage`,
        completed: data.completed ?? sql`reading_progress.completed`,
        device: data.device ?? sql`reading_progress.device`,
        lastReadAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning()

  if (!row) throw new Error("Failed to upsert reading progress")
  return row
}

export async function listContinueReading(
  db: DB,
  userId: string,
  limit = 6,
): Promise<ReadingProgress[]> {
  return db
    .select()
    .from(readingProgress)
    .where(
      and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.completed, false),
      ),
    )
    .orderBy(desc(readingProgress.lastReadAt))
    .limit(limit)
}

export async function listReadingHistory(
  db: DB,
  userId: string,
  opts: { days?: number; limit?: number; offset?: number } = {},
): Promise<ReadingProgress[]> {
  const days = opts.days ?? 90
  const limit = opts.limit ?? 50
  const offset = opts.offset ?? 0
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  return db
    .select()
    .from(readingProgress)
    .where(
      and(
        eq(readingProgress.userId, userId),
        gt(readingProgress.lastReadAt, cutoff),
      ),
    )
    .orderBy(desc(readingProgress.lastReadAt))
    .limit(limit)
    .offset(offset)
}

export async function markCompleted(
  db: DB,
  userId: string,
  objectId: string,
): Promise<void> {
  await db
    .update(readingProgress)
    .set({
      completed: true,
      percentage: 100,
      scrollPosition: 1,
      lastReadAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.objectId, objectId),
      ),
    )
}
```

### Design notes

- `upsertProgress` uses `onConflictDoUpdate` against the unique
  `(userId, objectId)` index. On conflict, fields that the caller did not
  supply fall back to the existing column value via
  `sql`reading_progress.<col>``.
- `listContinueReading` returns incomplete items ordered by recency —
  exactly the "Continue Reading: The Shadow — 68%" homepage card.
- `listReadingHistory` defaults to 90 days per `reading-memory.md`,
  paginated via `offset`.
- `markCompleted` is idempotent: setting `completed=true, percentage=100`
  in one update.
- No raw SQL needed — Drizzle ORM covers every query here.

### Barrel export

Add to `packages/database/src/index.ts`:

```ts
export * from "./reading-memory"
```

The `schema/social.ts` export already flows through `schema/index.ts`.

---

## Section 3 — Multi-hop graph queries in `relationships.ts`

Extend `packages/database/src/relationships.ts` with three new functions
and four new exported types. The existing functions (`findRelations`,
`createRelation`, `removeRelation`, `getGraphEdges`, `getGraphNodes`)
remain unchanged.

### New types

Append to `relationships.ts`:

```ts
export interface SubgraphNode {
  id: string                 // objects.id
  objectId: string           // same as id (kept for GraphNode compatibility)
  label: string              // objects.title
  objectType: string         // objects.object_type
  degree: number             // computed: count of incident edges in subgraph
  depth: number              // hops from root (0 = root itself)
  influenceScore: number     // objects.backlink_count as proxy
}

export interface SubgraphEdge {
  id: string                 // relationships.id
  source: string             // objectId (NOT graphNodes.id)
  target: string             // objectId
  relationType: string
  weight: "primary" | "secondary" | "tertiary"
  confidence: "verified" | "suggested" | "automatic"
}

export interface Subgraph {
  nodes: SubgraphNode[]
  edges: SubgraphEdge[]
}

export interface SharedConnection {
  objectId: string
  title: string
  objectType: string
  strength: number           // COUNT of shared edges
}

export interface PrerequisiteNode {
  objectId: string
  title: string
  objectType: string
  relationType: string
  depth: number              // hops from root
}
```

### `getSubgraph` — recursive N-hop traversal

```ts
export interface GetSubgraphOptions {
  maxDepth: 1 | 2 | 3
  nodeTypes?: string[]
  relationTypes?: string[]
  limit?: number             // default 200
}

export async function getSubgraph(
  db: DB,
  rootObjectId: string,
  opts: GetSubgraphOptions,
): Promise<Subgraph> {
  const maxDepth = opts.maxDepth
  const limit = opts.limit ?? 200
  const nodeTypes = opts.nodeTypes ?? []
  const relationTypes = opts.relationTypes ?? []

  const nodeTypesList = nodeTypes.length > 0
    ? drizzleSql.raw(`(${nodeTypes.map((t) => `'${t.replace(/'/g, "''")}'`).join(",")})`)
    : drizzleSql.raw("NULL")
  const relationTypesList = relationTypes.length > 0
    ? drizzleSql.raw(`(${relationTypes.map((t) => `'${t.replace(/'/g, "''")}'`).join(",")})`)
    : drizzleSql.raw("NULL")

  // 1. Recursively walk relationships, collecting reachable objectIds.
  // 2. Materialize nodes from objects, edges from relationships.
  const rows = await db.execute<{
    object_id: string
    title: string
    object_type: string
    depth: number
    backlink_count: number
    rel_id: string | null
    src_id: string | null
    tgt_id: string | null
    relation_type: string | null
    weight: string | null
    confidence: string | null
  }>(sql`
    WITH RECURSIVE reach AS (
      SELECT
        ${sql.raw("objects.id")} AS object_id,
        ${sql.raw("objects.title")} AS title,
        ${sql.raw("objects.object_type")} AS object_type,
        0 AS depth,
        ${sql.raw("objects.backlink_count")} AS backlink_count
      FROM objects
      WHERE ${sql.raw("objects.id")} = ${rootObjectId}
        AND ${sql.raw("objects.deleted_at")} IS NULL

      UNION

      SELECT
        CASE
          WHEN r.source_id = reach.object_id THEN r.target_id
          ELSE r.source_id
        END AS object_id,
        o.title,
        o.object_type,
        reach.depth + 1 AS depth,
        o.backlink_count
      FROM reach
      JOIN relationships r
        ON r.source_id = reach.object_id OR r.target_id = reach.object_id
      JOIN objects o
        ON o.id = CASE WHEN r.source_id = reach.object_id THEN r.target_id ELSE r.source_id END
      WHERE reach.depth < ${maxDepth}
        AND o.deleted_at IS NULL
        ${nodeTypesList} IS NULL OR o.object_type = ANY(${nodeTypesList})
        ${relationTypesList} IS NULL OR r.relation_type = ANY(${relationTypesList})
    )
    SELECT
      reach.object_id,
      reach.title,
      reach.object_type,
      reach.depth,
      reach.backlink_count,
      r.id AS rel_id,
      r.source_id AS src_id,
      r.target_id AS tgt_id,
      r.relation_type,
      r.weight,
      r.confidence
    FROM reach
    LEFT JOIN relationships r
      ON r.source_id = reach.object_id OR r.target_id = reach.object_id
    ORDER BY reach.depth ASC, reach.object_id ASC
    LIMIT ${limit * 4}
  `)

  // Dedup nodes by objectId (recursive CTE can revisit via different paths).
  const nodeMap = new Map<string, SubgraphNode>()
  const edgeMap = new Map<string, SubgraphEdge>()
  const degreeCounter = new Map<string, number>()

  for (const row of rows.rows ?? rows) {
    const r = row as any
    if (!nodeMap.has(r.object_id)) {
      nodeMap.set(r.object_id, {
        id: r.object_id,
        objectId: r.object_id,
        label: r.title,
        objectType: r.object_type,
        degree: 0,
        depth: r.depth,
        influenceScore: r.backlink_count,
      })
    }
    if (r.rel_id && !edgeMap.has(r.rel_id)) {
      const srcObjId = r.src_id
      const tgtObjId = r.tgt_id
      // Only keep edges where both endpoints are inside the subgraph.
      if (nodeMap.has(srcObjId) && nodeMap.has(tgtObjId)) {
        edgeMap.set(r.rel_id, {
          id: r.rel_id,
          source: srcObjId,
          target: tgtObjId,
          relationType: r.relation_type,
          weight: r.weight,
          confidence: r.confidence,
        })
        degreeCounter.set(srcObjId, (degreeCounter.get(srcObjId) ?? 0) + 1)
        degreeCounter.set(tgtObjId, (degreeCounter.get(tgtObjId) ?? 0) + 1)
      }
    }
  }

  // Apply node cap: keep root + highest-degree nodes up to limit.
  const allNodes = Array.from(nodeMap.values())
  if (allNodes.length > limit) {
    const root = allNodes.find((n) => n.depth === 0)!
    const rest = allNodes
      .filter((n) => n.depth !== 0)
      .sort((a, b) => b.influenceScore - a.influenceScore)
      .slice(0, limit - 1)
    const kept = new Set([root.objectId, ...rest.map((n) => n.objectId)])
    for (const node of allNodes) {
      if (!kept.has(node.objectId)) nodeMap.delete(node.objectId)
    }
    for (const edge of edgeMap.values()) {
      if (!kept.has(edge.source) || !kept.has(edge.target)) {
        edgeMap.delete(edge.id)
      }
    }
  }

  // Patch degrees from counter.
  for (const node of nodeMap.values()) {
    node.degree = degreeCounter.get(node.objectId) ?? 0
  }

  return {
    nodes: Array.from(nodeMap.values()).sort((a, b) => a.depth - b.depth),
    edges: Array.from(edgeMap.values()),
  }
}
```

### `getSharedConnections` — rule-based collaborative filtering

```ts
export interface GetSharedConnectionsOptions {
  limit?: number       // default 6 per docs
  minStrength?: number // default 1
}

export async function getSharedConnections(
  db: DB,
  objectId: string,
  opts: GetSharedConnectionsOptions = {},
): Promise<SharedConnection[]> {
  const limit = opts.limit ?? 6
  const minStrength = opts.minStrength ?? 1

  const result = await db.execute<{
    object_id: string
    title: string
    object_type: string
    strength: number
  }>(sql`
    SELECT r2.target_id AS object_id,
           o.title,
           o.object_type,
           COUNT(*) AS strength
    FROM relationships r1
    JOIN relationships r2
      ON r1.target_id = r2.source_id
    JOIN objects o
      ON o.id = r2.target_id
    WHERE r1.source_id = ${objectId}
      AND r2.target_id != ${objectId}
      AND o.deleted_at IS NULL
      AND o.status = 'published'
    GROUP BY r2.target_id, o.title, o.object_type
    HAVING COUNT(*) >= ${minStrength}
    ORDER BY strength DESC
    LIMIT ${limit}
  `)

  return (result.rows ?? result).map((r: any) => ({
    objectId: r.object_id,
    title: r.title,
    objectType: r.object_type,
    strength: Number(r.strength),
  }))
}
```

### `getPrerequisites` — learning path generation

```ts
export interface GetPrerequisitesOptions {
  direction?: "upstream" | "downstream" | "both"  // default both
  maxDepth?: number                                  // default 3
  limit?: number                                     // default 20
}

const PREREQ_RELATION_TYPES = ["precedes", "derives_from", "contains"] as const

export async function getPrerequisites(
  db: DB,
  objectId: string,
  opts: GetPrerequisitesOptions = {},
): Promise<PrerequisiteNode[]> {
  const direction = opts.direction ?? "both"
  const maxDepth = opts.maxDepth ?? 3
  const limit = opts.limit ?? 20

  // upstream:  objects that "precede"/"derive_into"/"contain" the current node
  //            → their target is the current node.
  // downstream: objects that the current node "precedes"/"derives_from"/"contains"
  //            → their source is the current node.
  // both:      union of the two.
  //
  // For prerequisites we treat edges as:
  //   source --precedes--> target   means "source comes before target"
  //   source --derives_from--> target  means "source derives from target"
  //                                → target is the prerequisite
  //   source --contains--> target   means "source contains target"
  //                                → source is the parent (prerequisite)
  //
  // upstream query: find nodes X such that X precedes current
  //   → r.source_id = X, r.target_id = current, relation in PREREQ_TYPES
  // downstream query: find nodes Y such that current precedes Y
  //   → r.source_id = current, r.target_id = Y, relation in PREREQ_TYPES

  const directionClause =
    direction === "upstream"
      ? sql`r.target_id = ${objectId}`
      : direction === "downstream"
        ? sql`r.source_id = ${objectId}`
        : sql`r.source_id = ${objectId} OR r.target_id = ${objectId}`

  const rows = await db.execute<{
    object_id: string
    title: string
    object_type: string
    relation_type: string
    depth: number
  }>(sql`
    WITH RECURSIVE prereq AS (
      SELECT
        CASE
          WHEN r.source_id = ${objectId} THEN r.target_id
          ELSE r.source_id
        END AS object_id,
        o.title,
        o.object_type,
        r.relation_type,
        1 AS depth
      FROM relationships r
      JOIN objects o
        ON o.id = CASE WHEN r.source_id = ${objectId} THEN r.target_id ELSE r.source_id END
      WHERE ${directionClause}
        AND r.relation_type = ANY(${sql.raw(`(ARRAY['precedes','derives_from','contains']::varchar[])`)})
        AND o.deleted_at IS NULL
        AND o.status = 'published'

      UNION

      SELECT
        CASE
          WHEN r.source_id = prereq.object_id THEN r.target_id
          ELSE r.source_id
        END AS object_id,
        o.title,
        o.object_type,
        r.relation_type,
        prereq.depth + 1 AS depth
      FROM prereq
      JOIN relationships r
        ON r.source_id = prereq.object_id OR r.target_id = prereq.object_id
      JOIN objects o
        ON o.id = CASE WHEN r.source_id = prereq.object_id THEN r.target_id ELSE r.source_id END
      WHERE prereq.depth < ${maxDepth}
        AND r.relation_type = ANY(${sql.raw(`(ARRAY['precedes','derives_from','contains']::varchar[])`)})
        AND o.deleted_at IS NULL
        AND o.status = 'published'
    )
    SELECT DISTINCT ON (object_id) object_id, title, object_type, relation_type, depth
    FROM prereq
    ORDER BY object_id, depth ASC
    LIMIT ${limit}
  `)

  return (rows.rows ?? rows).map((r: any) => ({
    objectId: r.object_id,
    title: r.title,
    objectType: r.object_type,
    relationType: r.relation_type,
    depth: r.depth,
  }))
}
```

### Design notes for Section 3

- All three functions return `objectId` (not `graphNodes.id`). The graph
  engine in Spec B converts objectId → GraphNode at the render layer.
- `getSubgraph` uses a recursive CTE so depth is a SQL variable, not a
  fixed number of joins. The CTE explores both directions
  (`source_id = X OR target_id = X`) because relationships are directed
  but exploration is undirected for visualization.
- The `UNION` (not `UNION ALL`) in the CTE dedups `(object_id, depth)`
  pairs naturally — Postgres collapses repeat visits at the same depth.
  We still dedup nodes client-side because the same object can appear at
  different depths via different paths; we keep the shallowest depth.
- The `LEFT JOIN relationships` in the outer query is what produces the
  edge rows: every reachable node pairs with its incident edges. We then
  filter client-side to edges whose both endpoints are in the subgraph.
- `limit * 4` on the SQL LIMIT is a safety buffer: each node can have up
  to ~4 incident edges within a bounded subgraph, so we pull enough rows
  to materialize both nodes and edges in one round trip.
- `getSharedConnections` is a direct 2-hop join (matches the SQL in
  `recommendation.md`). `minStrength` filters weak shared edges.
- `getPrerequisites` filters to the three relation types the docs call out
  in `learning-paths.md`: `precedes`, `derives_from`, `contains`. The
  recursive CTE handles N-hop prerequisite chains (e.g. Consciousness →
  Ego → Persona → Shadow). `DISTINCT ON (object_id)` keeps the shallowest
  occurrence.

### Required imports to add at top of `relationships.ts`

```ts
import { eq, and, sql } from "drizzle-orm"
import { sql as drizzleSql } from "drizzle-orm"
```

(The existing `import { eq, and, sql } from "drizzle-orm"` stays; the
second alias `drizzleSql` is only used for `sql.raw` calls inside
`getSubgraph`.)

---

## Section 4 — Indexes

No new indexes needed. The existing `triggers/indexes.sql` already has:

- `idx_relationships_source ON relationships (source_id)`
- `idx_relationships_target ON relationships (target_id)`
- `idx_relationships_type ON relationships (relation_type)`
- `idx_relationships_pair ON relationships (source_id, target_id)`

These cover every query in Section 3. The `reading_progress` table's two
indexes (`reading_progress_user_object_unq`,
`reading_progress_user_last_read_idx`) are declared in the schema and
created by the generated migration — no manual `indexes.sql` edit needed.

---

## Section 5 — Exports & integration

### `packages/database/src/schema/social.ts`
Add `readingProgress` table definition (Section 1). Existing exports
unchanged.

### `packages/database/src/schema/index.ts`
No change — already does `export * from "./social"`, which picks up the
new table automatically.

### `packages/database/src/index.ts`
Add one line:

```ts
export * from "./reading-memory"
```

### `packages/database/src/relationships.ts`
Add the four new types and three new functions from Section 3. Existing
functions unchanged. The barrel `export * from "./relationships"` in
`index.ts` already picks up new exports.

### Migration generation
```bash
cd packages/database
pnpm db:generate
```

Drizzle Kit produces `drizzle/<timestamp>_reading_progress.sql`. Inspect
the file to confirm:
- `CREATE TABLE "reading_progress" (...)`
- `CREATE UNIQUE INDEX "reading_progress_user_object_unq" ...`
- `CREATE UNIQUE INDEX "reading_progress_user_last_read_idx" ...`

Commit the migration file.

---

## Section 6 — Testing strategy

### Framework
vitest, already configured in `packages/database/package.json`.

### Unit tests — mock Drizzle DB

Create `packages/database/src/__tests__/reading-memory.test.ts` and
`packages/database/src/__tests__/relationships-graph.test.ts`.

Mock `db` with `vi.fn()` per method. Each test asserts the function calls
the right chain (`.select().from().where()...`) and returns the expected
shape. No Postgres connection required.

Example pattern (following what the existing codebase would look like):

```ts
import { describe, it, expect, vi } from "vitest"
import { getProgress } from "../reading-memory"

describe("getProgress", () => {
  it("returns null when no row matches", async () => {
    const limit = vi.fn().mockResolvedValue([])
    const where = vi.fn().mockReturnValue({ limit })
    const from = vi.fn().mockReturnValue({ where })
    const select = vi.fn().mockReturnValue({ from })
    const db = { select } as any

    const result = await getProgress(db, "u1", "o1")
    expect(result).toBeNull()
    expect(select).toHaveBeenCalledTimes(1)
  })

  it("returns the row when found", async () => {
    const row = { id: "p1", userId: "u1", objectId: "o1", percentage: 68 }
    const limit = vi.fn().mockResolvedValue([row])
    const where = vi.fn().mockReturnValue({ limit })
    const from = vi.fn().mockReturnValue({ where })
    const select = vi.fn().mockReturnValue({ from })
    const db = { select } as any

    const result = await getProgress(db, "u1", "o1")
    expect(result).toEqual(row)
  })
})
```

### Coverage targets

`reading-memory.ts`:
- `getProgress` — found + not-found
- `upsertProgress` — insert path + conflict-update path
- `listContinueReading` — returns incomplete, ordered by recency
- `listReadingHistory` — 90-day cutoff filter, pagination
- `markCompleted` — sets completed=true, percentage=100

`relationships.ts` (new functions):
- `getSubgraph` — 1-hop, 2-hop, 3-hop, type filter, relation filter, limit cap, empty result
- `getSharedConnections` — ordering by strength, minStrength filter, limit
- `getPrerequisites` — upstream, downstream, both, maxDepth cap, limit

### Integration tests — real Postgres

Create `packages/database/src/__tests__/*.integration.test.ts`. Skip when
`DATABASE_URL` is unset:

```ts
import { describe, it, expect } from "vitest"
const SKIP = !process.env.DATABASE_URL
describe.skipIf(SKIP)("getSubgraph integration", () => {
  it("returns the root + 1-hop neighbors for a seeded concept", async () => {
    // seed: insert 3 objects, 2 relationships
    // assert: getSubgraph returns 3 nodes, 2 edges, root.depth=0
  })
})
```

Integration tests are smoke tests, not exhaustive. They prove the
recursive CTE parses and returns the right shape against a real Postgres.

### Verification commands

```bash
cd packages/database
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint src/
pnpm test         # vitest run (unit only by default)
DATABASE_URL=postgres://... pnpm test   # unit + integration
```

All three must pass before Spec A is considered done.

---

## Section 7 — Acceptance criteria

- [ ] `reading_progress` table exists with two unique indexes
- [ ] `getProgress`, `upsertProgress`, `listContinueReading`,
      `listReadingHistory`, `markCompleted` all exported from
      `@archron/database`
- [ ] `getSubgraph` returns `{nodes, edges}` for depths 1, 2, 3 with
      node-type and relation-type filters
- [ ] `getSharedConnections` returns up to N results ordered by strength
- [ ] `getPrerequisites` returns upstream, downstream, or both directions
      respecting maxDepth
- [ ] All new code is typecheck-clean (`pnpm typecheck`)
- [ ] All new code is lint-clean (`pnpm lint`)
- [ ] Unit tests pass without a Postgres connection
- [ ] Integration tests pass when `DATABASE_URL` is set
- [ ] Migration file committed under `packages/database/drizzle/`
- [ ] No existing CRUD signatures changed (additive only)

---

## Section 8 — Risks

| Risk | Mitigation |
|------|------------|
| Recursive CTE explodes on a high-degree hub | `maxDepth` capped at 3, `limit` caps node count, query uses `LIMIT limit*4` as a safety net |
| `sql.raw` injection if nodeTypes/relationTypes contain quotes | Caller controls inputs (typed `string[]`), plus single-quote escape `t.replace(/'/g, "''")` |
| Drizzle `db.execute` return shape differs between `postgres` driver versions | Code reads `rows.rows ?? rows` to handle both shapes |
| `onConflictDoUpdate` falls back to existing column value | Uses `sql`reading_progress.<col>`` for unsupplied fields, matching the documented Drizzle pattern |
| Migration file timestamp collides with another branch | Rebase + regenerate before merge if conflict |

---

## Section 9 — Out of scope for Spec A

- Phase 8 graph engine (force layout, Three.js renderer, React wrapper) — Spec B
- Recommendation engine business logic (uses `getSharedConnections` but lives in `@archron/graph` or a new `@archron/recommendation` package — decided in Spec B)
- Learning path engine business logic (uses `getPrerequisites` but the engine itself is Spec B)
- Reading memory React hook (uses `upsertProgress` but the hook is Spec B)
- AI Companion (Phase 8 milestone 10.6 — explicitly deferred)

---

## Files touched

| File | Change |
|------|--------|
| `packages/database/src/schema/social.ts` | Add `readingProgress` table |
| `packages/database/src/reading-memory.ts` | NEW file — CRUD module |
| `packages/database/src/relationships.ts` | Add 4 types + 3 functions |
| `packages/database/src/index.ts` | Add 1 export line |
| `packages/database/drizzle/<ts>_reading_progress.sql` | NEW generated migration |
| `packages/database/src/__tests__/reading-memory.test.ts` | NEW unit tests |
| `packages/database/src/__tests__/relationships-graph.test.ts` | NEW unit tests |
| `packages/database/src/__tests__/reading-memory.integration.test.ts` | NEW integration test |
| `packages/database/src/__tests__/relationships-graph.integration.test.ts` | NEW integration test |

No existing files are refactored. All changes are additive.

---

End of Spec A.
