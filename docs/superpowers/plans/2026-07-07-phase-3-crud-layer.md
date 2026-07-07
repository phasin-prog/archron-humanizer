# Phase 3 — Database CRUD Layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the database CRUD layer (`db.ts` + 5 CRUD files) then wire `KnowledgeEngine` with real DB queries.

**Architecture:** Pure functions — `(db, ...args) => Promise<T>`. One file per schema group. All types live in `@archron/shared` to avoid circular deps.

**Tech Stack:** TypeScript, Drizzle ORM, PostgreSQL via `postgres` package, Vitest, TurboRepo.

## Global Constraints

- No classes — pure functions only for CRUD
- `db` is always first parameter
- All DB operations use Drizzle query builders
- Types import from `@archron/shared` only (never `@archron/knowledge-engine` from `@archron/database`)
- Every create/update uses Drizzle transactions where multiple tables are touched
- `tsconfig.json` ต้องตั้ง `strict: true`

---

## File Structure

```
packages/shared/src/
  types/
    knowledge.ts          # MODIFY — add query/result types

packages/database/src/
  db.ts                   # CREATE — Drizzle client
  objects.ts              # CREATE — objects + domain CRUD
  relationships.ts        # CREATE — relationships + graph CRUD
  users.ts                # CREATE — users + profiles CRUD
  social.ts               # CREATE — social features CRUD
  infrastructure.ts       # CREATE — infra CRUD
  index.ts                # MODIFY — re-export new files

packages/knowledge-engine/src/
  index.ts                # MODIFY — wire real DB queries
```

## Parallel Execution Map

```
Task 0 (types) ──► Task 1 (db.ts) ──┬──► Task 2 (objects.ts)       ──┬──► Task 7 (KE)
                                     ├──► Task 3 (users.ts)          │
                                     ├──► Task 4 (relationships.ts)  │
                                     ├──► Task 5 (social.ts)         │
                                     └──► Task 6 (infrastructure.ts) ┘
                                     ↓
                                     Task 8 (index.ts exports)
```

Tasks 2-6 can run in parallel after Task 1. Task 7 depends on Tasks 2+4.

---

### Task 0: Move query/result types to @archron/shared

**Files:**
- Modify: `packages/shared/src/types/knowledge.ts`

**Interfaces:**
- Produces: `ObjectQuery`, `ObjectResult`, `RelationQuery`, `RelationResult` exported from shared

- [ ] **Step 1: Read current file**

File ends with `KnowledgeObject` union type at line 116.

- [ ] **Step 2: Append types**

Add after the `KnowledgeObject` type (after line 116):

```ts
export interface ObjectQuery {
  ids?: string[]
  slugs?: string[]
  types?: ObjectType[]
  status?: ContentState[]
  language?: string
  difficulty?: string
  domains?: string[]
  tags?: string[]
  limit?: number
  offset?: number
  sort?: "recent" | "title" | "backlinks" | "views"
  includeDeleted?: boolean
}

export interface ObjectResult {
  id: string
  objectType: ObjectType
  slug: string
  title: string
  status: ContentState
  visibility: string
  language: string
  difficulty: string
  description: string
  aliases: string[]
  domains: string[]
  tags: string[]
  thumbnail?: string
  readingTime?: number
  wordCount?: number
  viewCount: number
  backlinkCount: number
  version: number
  authorId?: string
  editorId?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface RelationQuery {
  objectId: string
  relationTypes?: string[]
  direction?: "outgoing" | "incoming" | "both"
  limit?: number
  offset?: number
}

export interface RelationResult {
  id: string
  sourceId: string
  targetId: string
  relationType: string
  weight: string
  confidence: string
  source?: ObjectResult
  target?: ObjectResult
}
```

- [ ] **Step 3: Add ContentState import**

The `ObjectResult` uses `ContentState` from `./content`. Add import at top of `knowledge.ts`:

```ts
import type { ContentState } from "./content"
```

Wait — `content.ts` imports from `knowledge.ts`. This would create a circular import. Instead, use `string` for status type or inline the ContentState values. Better: use `string` since these are transport types, not domain-invariant types.

Replace `status: ContentState` with `status: string` in ObjectResult.

- [ ] **Step 4: Verify types compile**

```bash
pnpm --filter @archron/shared typecheck
```

Expected: PASS with no errors.

- [ ] **Step 5: Remove types from knowledge-engine**

In `packages/knowledge-engine/src/index.ts`, remove the `ObjectQuery`, `ObjectResult`, `RelationQuery`, `RelationResult` interface definitions (lines 1-59). Replace with imports:

```ts
import type { ObjectQuery, ObjectResult, RelationQuery, RelationResult } from "@archron/shared"
```

Keep `KnowledgeEngineOptions` and the class.

- [ ] **Step 6: Verify knowledge-engine compiles**

```bash
pnpm --filter @archron/knowledge-engine typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/shared/src/types/knowledge.ts packages/knowledge-engine/src/index.ts
git commit -m "refactor: move ObjectQuery/ObjectResult/RelationQuery/RelationResult to @archron/shared"
```

---

### Task 1: Create db.ts — Drizzle Client

**Files:**
- Create: `packages/database/src/db.ts`

**Interfaces:**
- Produces: `db` (Drizzle instance), `DB` (type of db)

- [ ] **Step 1: Write db.ts**

```ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

const queryClient = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(queryClient, { schema })

export type DB = typeof db
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS. The `db` type should resolve to `PostgresJsDatabase<typeof schema>`.

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/db.ts
git commit -m "feat(database): add Drizzle client with PostgreSQL connection"
```

---

### Task 2: Create objects.ts — Objects + Domain CRUD

**Files:**
- Create: `packages/database/src/objects.ts`

**Interfaces:**
- Consumes: `db: DB` from Task 1, `ObjectQuery`, `ObjectResult` from shared
- Produces: `findObjectById()`, `findObjectBySlug()`, `listObjects()`, `createObject()`, `updateObject()`, `softDeleteObject()`, `publishObject()`, `incrementViewCount()`

- [ ] **Step 1: Write objects.ts**

```ts
import { eq, asc, desc, and, isNull, inArray, sql, SQL } from "drizzle-orm"
import type { ObjectQuery, ObjectResult } from "@archron/shared"
import type { DB } from "./db"
import { objects } from "./schema/core"
import * as knowledge from "./schema/knowledge"

type DomainTable =
  | typeof knowledge.concepts
  | typeof knowledge.thinkers
  | typeof knowledge.books
  | typeof knowledge.articles
  | typeof knowledge.theories
  | typeof knowledge.schools
  | typeof knowledge.disciplines
  | typeof knowledge.symbols
  | typeof knowledge.quotes
  | typeof knowledge.timelineEvents

const DOMAIN_MAP: Record<string, DomainTable> = {
  concept: knowledge.concepts,
  thinker: knowledge.thinkers,
  book: knowledge.books,
  article: knowledge.articles,
  theory: knowledge.theories,
  school: knowledge.schools,
  discipline: knowledge.disciplines,
  symbol: knowledge.symbols,
  quote: knowledge.quotes,
  timeline_event: knowledge.timelineEvents,
}

function getDomainTable(objectType: string): DomainTable | null {
  return DOMAIN_MAP[objectType] ?? null
}

function mapObjectRow(row: any): ObjectResult {
  const result: ObjectResult = {
    id: row.id,
    objectType: row.object_type,
    slug: row.slug,
    title: row.title,
    status: row.status,
    visibility: row.visibility,
    language: row.language,
    difficulty: row.difficulty,
    description: row.description,
    aliases: row.aliases ?? [],
    domains: row.domains ?? [],
    tags: row.tags ?? [],
    thumbnail: row.thumbnail,
    readingTime: row.reading_time,
    wordCount: row.word_count,
    viewCount: row.view_count,
    backlinkCount: row.backlink_count,
    version: row.version,
    authorId: row.author_id,
    editorId: row.editor_id,
    publishedAt: row.published_at?.toISOString?.() ?? row.published_at,
    createdAt: row.created_at?.toISOString?.() ?? row.created_at,
    updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
  }
  return result
}

export async function findObjectById(db: DB, id: string): Promise<ObjectResult | null> {
  const [obj] = await db.select().from(objects).where(eq(objects.id, id)).limit(1)
  if (!obj) return null
  return mapObjectRow(obj)
}

export async function findObjectBySlug(db: DB, slug: string): Promise<ObjectResult | null> {
  const [obj] = await db
    .select()
    .from(objects)
    .where(and(eq(objects.slug, slug), isNull(objects.deletedAt)))
    .limit(1)
  if (!obj) return null
  return mapObjectRow(obj)
}

export async function listObjects(db: DB, query: ObjectQuery = {}): Promise<ObjectResult[]> {
  const conditions: SQL[] = [isNull(objects.deletedAt)]

  if (query.types?.length) {
    conditions.push(inArray(objects.objectType, query.types))
  }
  if (query.status?.length) {
    conditions.push(inArray(objects.status, query.status))
  }
  if (query.language) {
    conditions.push(eq(objects.language, query.language))
  }
  if (query.difficulty) {
    conditions.push(eq(objects.difficulty, query.difficulty))
  }
  if (query.domains?.length) {
    conditions.push(sql`${objects.domains} && ${query.domains}::varchar[]`)
  }
  if (query.tags?.length) {
    conditions.push(sql`${objects.tags} && ${query.tags}::varchar[]`)
  }

  let orderBy = desc(objects.createdAt)
  if (query.sort === "title") orderBy = asc(objects.title)
  else if (query.sort === "backlinks") orderBy = desc(objects.backlinkCount)
  else if (query.sort === "views") orderBy = desc(objects.viewCount)

  const rows = await db
    .select()
    .from(objects)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(query.limit ?? 50)
    .offset(query.offset ?? 0)

  return rows.map(mapObjectRow)
}

export interface CreateObjectData {
  objectType: string
  slug: string
  title: string
  description: string
  authorId?: string
  status?: string
  visibility?: string
  language?: string
  difficulty?: string
  aliases?: string[]
  domains?: string[]
  tags?: string[]
  thumbnail?: string
  readingTime?: number
  wordCount?: number
}

export interface DomainData {
  concept?: Partial<typeof knowledge.concepts.$inferInsert>
  thinker?: Partial<typeof knowledge.thinkers.$inferInsert>
  book?: Partial<typeof knowledge.books.$inferInsert>
  article?: Partial<typeof knowledge.articles.$inferInsert>
  theory?: Partial<typeof knowledge.theories.$inferInsert>
  school?: Partial<typeof knowledge.schools.$inferInsert>
  discipline?: Partial<typeof knowledge.disciplines.$inferInsert>
  symbol?: Partial<typeof knowledge.symbols.$inferInsert>
  quote?: Partial<typeof knowledge.quotes.$inferInsert>
  timeline_event?: Partial<typeof knowledge.timelineEvents.$inferInsert>
}

export async function createObject(
  db: DB,
  data: CreateObjectData,
  domainData?: DomainData,
): Promise<ObjectResult> {
  const result = await db.transaction(async (tx) => {
    const [obj] = await tx
      .insert(objects)
      .values({
        objectType: data.objectType,
        slug: data.slug,
        title: data.title,
        description: data.description,
        authorId: data.authorId,
        status: data.status ?? "draft",
        visibility: data.visibility ?? "public",
        language: data.language ?? "th",
        difficulty: data.difficulty ?? "intermediate",
        aliases: data.aliases ?? [],
        domains: data.domains ?? [],
        tags: data.tags ?? [],
        thumbnail: data.thumbnail,
        readingTime: data.readingTime,
        wordCount: data.wordCount,
      })
      .returning()

    if (domainData) {
      const domainTable = getDomainTable(data.objectType)
      const domainValues = domainData[data.objectType as keyof DomainData]
      if (domainTable && domainValues) {
        await tx.insert(domainTable as any).values({
          ...domainValues,
          objectId: obj.id,
        })
      }
    }

    return obj
  })

  return mapObjectRow(result)
}

export async function updateObject(
  db: DB,
  id: string,
  data: Partial<CreateObjectData>,
): Promise<ObjectResult | null> {
  const [obj] = await db
    .update(objects)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.visibility !== undefined && { visibility: data.visibility }),
      ...(data.language !== undefined && { language: data.language }),
      ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
      ...(data.aliases !== undefined && { aliases: data.aliases }),
      ...(data.domains !== undefined && { domains: data.domains }),
      ...(data.tags !== undefined && { tags: data.tags }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      ...(data.readingTime !== undefined && { readingTime: data.readingTime }),
      ...(data.wordCount !== undefined && { wordCount: data.wordCount }),
    })
    .where(eq(objects.id, id))
    .returning()

  if (!obj) return null
  return mapObjectRow(obj)
}

export async function softDeleteObject(db: DB, id: string): Promise<void> {
  await db
    .update(objects)
    .set({ deletedAt: new Date() })
    .where(eq(objects.id, id))
}

export async function publishObject(db: DB, id: string): Promise<ObjectResult | null> {
  const [obj] = await db
    .update(objects)
    .set({
      status: "published",
      publishedAt: new Date(),
    })
    .where(eq(objects.id, id))
    .returning()

  if (!obj) return null
  return mapObjectRow(obj)
}

export async function incrementViewCount(db: DB, id: string): Promise<void> {
  await db
    .update(objects)
    .set({ viewCount: sql`${objects.viewCount} + 1` })
    .where(eq(objects.id, id))
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/objects.ts
git commit -m "feat(database): add objects CRUD with domain table support"
```

---

### Task 3: Create users.ts — Users + Profiles CRUD

**Files:**
- Create: `packages/database/src/users.ts`

**Interfaces:**
- Consumes: `db: DB` from Task 1
- Produces: `findUserByClerkId()`, `findUserById()`, `createUser()`, `findOrCreateUser()`, `updateProfile()`, `updateRole()`

- [ ] **Step 1: Write users.ts**

```ts
import { eq } from "drizzle-orm"
import type { DB } from "./db"
import { users, profiles } from "./schema/core"

export async function findUserByClerkId(
  db: DB,
  clerkId: string,
): Promise<typeof users.$inferSelect | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)
  return user ?? null
}

export async function findUserById(db: DB, id: string) {
  const [row] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      profile: {
        id: profiles.id,
        displayName: profiles.displayName,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        reputation: profiles.reputation,
        level: profiles.level,
      },
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, id))
    .limit(1)

  return row ?? null
}

export async function createUser(
  db: DB,
  data: { clerkId: string; email: string; role?: string },
): Promise<typeof users.$inferSelect> {
  const [user] = await db
    .insert(users)
    .values({
      clerkId: data.clerkId,
      email: data.email,
      role: data.role ?? "member",
    })
    .returning()

  return user
}

export async function findOrCreateUser(
  db: DB,
  clerkId: string,
  email: string,
): Promise<typeof users.$inferSelect> {
  const existing = await findUserByClerkId(db, clerkId)
  if (existing) return existing
  return createUser(db, { clerkId, email })
}

export async function updateProfile(
  db: DB,
  userId: string,
  data: {
    displayName?: string
    bio?: string
    avatarUrl?: string
  },
) {
  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)

  if (existing) {
    const [updated] = await db
      .update(profiles)
      .set(data)
      .where(eq(profiles.userId, userId))
      .returning()
    return updated
  }

  const [created] = await db
    .insert(profiles)
    .values({
      userId,
      displayName: data.displayName ?? "Member",
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    })
    .returning()

  return created
}

export async function updateRole(
  db: DB,
  userId: string,
  role: string,
): Promise<void> {
  await db.update(users).set({ role }).where(eq(users.id, userId))
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/users.ts
git commit -m "feat(database): add users and profiles CRUD"
```

---

### Task 4: Create relationships.ts — Relationships + Graph CRUD

**Files:**
- Create: `packages/database/src/relationships.ts`

**Interfaces:**
- Consumes: `db: DB` from Task 1, `RelationQuery`, `RelationResult` from shared, `ObjectResult` from Task 2 (type only)
- Produces: `findRelations()`, `createRelation()`, `removeRelation()`, `getGraphEdges()`, `getGraphNodes()`

- [ ] **Step 1: Write relationships.ts**

```ts
import { eq, and, inArray, sql } from "drizzle-orm"
import type { RelationQuery, RelationResult, ObjectResult } from "@archron/shared"
import type { DB } from "./db"
import { objects } from "./schema/core"
import { relationships, graphNodes, graphEdges } from "./schema/relationships"

function mapRelationRow(row: any): RelationResult {
  return {
    id: row.id,
    sourceId: row.source_id,
    targetId: row.target_id,
    relationType: row.relation_type,
    weight: row.weight,
    confidence: row.confidence,
  }
}

export async function findRelations(
  db: DB,
  query: RelationQuery,
): Promise<RelationResult[]> {
  const conditions = []
  const { objectId, relationTypes, direction = "both" } = query

  if (direction === "outgoing") {
    conditions.push(eq(relationships.sourceId, objectId))
  } else if (direction === "incoming") {
    conditions.push(eq(relationships.targetId, objectId))
  } else {
    conditions.push(
      sql`(${relationships.sourceId} = ${objectId} OR ${relationships.targetId} = ${objectId})`,
    )
  }

  if (relationTypes?.length) {
    conditions.push(inArray(relationships.relationType, relationTypes))
  }

  const rows = await db
    .select()
    .from(relationships)
    .where(and(...conditions))
    .limit(query.limit ?? 50)
    .offset(query.offset ?? 0)

  return rows.map(mapRelationRow)
}

export interface CreateRelationData {
  sourceId: string
  targetId: string
  relationType: string
  weight?: string
  confidence?: string
}

export async function createRelation(
  db: DB,
  data: CreateRelationData,
): Promise<RelationResult> {
  const result = await db.transaction(async (tx) => {
    const [rel] = await tx
      .insert(relationships)
      .values({
        sourceId: data.sourceId,
        targetId: data.targetId,
        relationType: data.relationType,
        weight: data.weight ?? "primary",
        confidence: data.confidence ?? "suggested",
      })
      .returning()

    for (const objId of [data.sourceId, data.targetId]) {
      const [existing] = await tx
        .select()
        .from(graphNodes)
        .where(eq(graphNodes.objectId, objId))
        .limit(1)

      if (!existing) {
        const [obj] = await tx
          .select({ title: objects.title, objectType: objects.objectType })
          .from(objects)
          .where(eq(objects.id, objId))
          .limit(1)

        if (obj) {
          await tx.insert(graphNodes).values({
            objectId: objId,
            label: obj.title,
            nodeType: obj.objectType,
          })
        }
      }
    }

    const [sourceNode] = await tx
      .select()
      .from(graphNodes)
      .where(eq(graphNodes.objectId, data.sourceId))
      .limit(1)
    const [targetNode] = await tx
      .select()
      .from(graphNodes)
      .where(eq(graphNodes.objectId, data.targetId))
      .limit(1)

    if (sourceNode && targetNode) {
      await tx.insert(graphEdges).values({
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        relationshipId: rel.id,
        label: data.relationType,
      })
    }

    await tx
      .update(objects)
      .set({ backlinkCount: sql`${objects.backlinkCount} + 1` })
      .where(eq(objects.id, data.targetId))

    return rel
  })

  return mapRelationRow(result)
}

export async function removeRelation(db: DB, id: string): Promise<void> {
  await db.transaction(async (tx) => {
    const [rel] = await tx
      .select()
      .from(relationships)
      .where(eq(relationships.id, id))
      .limit(1)

    if (rel) {
      await tx
        .delete(graphEdges)
        .where(eq(graphEdges.relationshipId, id))

      await tx
        .delete(relationships)
        .where(eq(relationships.id, id))

      await tx
        .update(objects)
        .set({ backlinkCount: sql`GREATEST(${objects.backlinkCount} - 1, 0)` })
        .where(eq(objects.id, rel.targetId))
    }
  })
}

export async function getGraphEdges(
  db: DB,
  nodeId: string,
): Promise<typeof graphEdges.$inferSelect[]> {
  return db
    .select()
    .from(graphEdges)
    .where(
      sql`(${graphEdges.sourceNodeId} = ${nodeId} OR ${graphEdges.targetNodeId} = ${nodeId})`,
    )
}

export async function getGraphNodes(
  db: DB,
  query: { nodeType?: string; limit?: number; offset?: number } = {},
): Promise<typeof graphNodes.$inferSelect[]> {
  const conditions = []
  if (query.nodeType) {
    conditions.push(eq(graphNodes.nodeType, query.nodeType))
  }

  return db
    .select()
    .from(graphNodes)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(query.limit ?? 100)
    .offset(query.offset ?? 0)
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/relationships.ts
git commit -m "feat(database): add relationships and graph CRUD"
```

---

### Task 5: Create social.ts — Social Features CRUD

**Files:**
- Create: `packages/database/src/social.ts`

**Interfaces:**
- Consumes: `db: DB` from Task 1
- Produces: collection CRUD (6 functions), guide CRUD (3 functions), achievement grant

- [ ] **Step 1: Write social.ts**

```ts
import { eq, asc, sql } from "drizzle-orm"
import type { DB } from "./db"
import { users } from "./schema/core"
import {
  collections,
  collectionItems,
  guides,
  guideLessons,
  achievements,
  userAchievements,
  reputationEvents,
} from "./schema/social"

// --- Collections ---

export async function getCollection(db: DB, id: string) {
  const [col] = await db
    .select()
    .from(collections)
    .where(eq(collections.id, id))
    .limit(1)
  if (!col) return null

  const items = await db
    .select()
    .from(collectionItems)
    .where(eq(collectionItems.collectionId, id))
    .orderBy(asc(collectionItems.sortOrder))

  return { ...col, items }
}

export async function listCollections(db: DB, ownerId: string) {
  return db
    .select()
    .from(collections)
    .where(eq(collections.ownerId, ownerId))
    .orderBy(asc(collections.createdAt))
}

export async function createCollection(
  db: DB,
  data: { ownerId: string; name: string; description?: string; isPublic?: boolean },
) {
  const [col] = await db
    .insert(collections)
    .values({
      ownerId: data.ownerId,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic ?? false,
    })
    .returning()
  return col
}

export async function addCollectionItem(
  db: DB,
  data: { collectionId: string; objectId: string; notes?: string; sortOrder?: number },
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.insert(collectionItems).values({
      collectionId: data.collectionId,
      objectId: data.objectId,
      notes: data.notes,
      sortOrder: data.sortOrder ?? 0,
    })
    await tx
      .update(collections)
      .set({ itemCount: sql`${collections.itemCount} + 1` })
      .where(eq(collections.id, data.collectionId))
  })
}

export async function removeCollectionItem(db: DB, itemId: string): Promise<void> {
  const [item] = await db
    .select()
    .from(collectionItems)
    .where(eq(collectionItems.id, itemId))
    .limit(1)

  if (item) {
    await db.transaction(async (tx) => {
      await tx
        .delete(collectionItems)
        .where(eq(collectionItems.id, itemId))
      await tx
        .update(collections)
        .set({ itemCount: sql`GREATEST(${collections.itemCount} - 1, 0)` })
        .where(eq(collections.id, item.collectionId))
    })
  }
}

export async function deleteCollection(db: DB, id: string): Promise<void> {
  await db.delete(collections).where(eq(collections.id, id))
}

// --- Guides ---

export async function getGuide(db: DB, id: string) {
  const [guide] = await db
    .select()
    .from(guides)
    .where(eq(guides.id, id))
    .limit(1)
  if (!guide) return null

  const lessons = await db
    .select()
    .from(guideLessons)
    .where(eq(guideLessons.guideId, id))
    .orderBy(asc(guideLessons.sequence))

  return { ...guide, lessons }
}

export async function listGuides(
  db: DB,
  query: { creatorId?: string; isPublished?: boolean; limit?: number; offset?: number } = {},
) {
  const conditions = []
  if (query.creatorId) conditions.push(eq(guides.creatorId, query.creatorId))
  if (query.isPublished !== undefined) conditions.push(eq(guides.isPublished, query.isPublished))

  return db
    .select()
    .from(guides)
    .where(conditions.length > 0 ? conditions.reduce((a, b) => sql`${a} AND ${b}`) : undefined)
    .limit(query.limit ?? 20)
    .offset(query.offset ?? 0)
}

export async function createGuide(
  db: DB,
  data: { creatorId: string; title: string; description?: string; estimatedHours?: number },
) {
  const [guide] = await db
    .insert(guides)
    .values({
      creatorId: data.creatorId,
      title: data.title,
      description: data.description,
      estimatedHours: data.estimatedHours,
    })
    .returning()
  return guide
}

// --- Achievements ---

export async function grantAchievement(
  db: DB,
  userId: string,
  achievementCode: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    const [achievement] = await tx
      .select()
      .from(achievements)
      .where(eq(achievements.code, achievementCode))
      .limit(1)

    if (!achievement) return

    const [existing] = await tx
      .select()
      .from(userAchievements)
      .where(
        sql`${userAchievements.userId} = ${userId} AND ${userAchievements.achievementId} = ${achievement.id}`,
      )
      .limit(1)

    if (existing) return

    await tx.insert(userAchievements).values({
      userId,
      achievementId: achievement.id,
    })

    await tx.insert(reputationEvents).values({
      userId,
      eventType: "achievement_earned",
      points: achievement.points,
      reason: achievement.name,
      referenceId: achievement.id,
    })
  })
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/social.ts
git commit -m "feat(database): add collections, guides, and achievements CRUD"
```

---

### Task 6: Create infrastructure.ts — Infrastructure CRUD

**Files:**
- Create: `packages/database/src/infrastructure.ts`

**Interfaces:**
- Consumes: `db: DB` from Task 1
- Produces: slug/alias/revision/reference CRUD (9 functions)

- [ ] **Step 1: Write infrastructure.ts**

```ts
import { eq, and, desc } from "drizzle-orm"
import type { DB } from "./db"
import { objects } from "./schema/core"
import {
  slugs,
  slugRedirects,
  aliases,
  revisions,
  references,
  objectReferences,
} from "./schema/infrastructure"

// --- Slugs ---

export async function registerSlug(
  db: DB,
  data: { objectId: string; slug: string; locale?: string },
) {
  const [slug] = await db
    .insert(slugs)
    .values({
      objectId: data.objectId,
      slug: data.slug,
      locale: data.locale ?? "th",
    })
    .returning()
  return slug
}

export async function findSlug(db: DB, slugValue: string) {
  const [result] = await db
    .select()
    .from(slugs)
    .where(and(eq(slugs.slug, slugValue), eq(slugs.isActive, true)))
    .limit(1)
  return result ?? null
}

export async function redirectSlug(
  db: DB,
  oldSlug: string,
  newSlug: string,
  objectId: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .update(slugs)
      .set({ isActive: false })
      .where(and(eq(slugs.slug, oldSlug), eq(slugs.objectId, objectId)))

    await tx.insert(slugRedirects).values({
      oldSlug,
      newSlug,
      objectId,
    })
  })
}

// --- Aliases ---

export async function addAlias(
  db: DB,
  data: { objectId: string; name: string; aliasType?: string; language?: string; isPrimary?: boolean },
) {
  const [alias] = await db
    .insert(aliases)
    .values({
      objectId: data.objectId,
      name: data.name,
      aliasType: data.aliasType ?? "alternate_name",
      language: data.language ?? "th",
      isPrimary: data.isPrimary ?? false,
    })
    .returning()
  return alias
}

export async function getAliases(db: DB, objectId: string) {
  return db.select().from(aliases).where(eq(aliases.objectId, objectId))
}

// --- Revisions ---

export async function saveRevision(
  db: DB,
  data: {
    objectId: string
    userId: string
    revisionType: string
    contentSnapshot?: string
    changeSummary?: string
    version: number
  },
) {
  const [revision] = await db
    .insert(revisions)
    .values({
      objectId: data.objectId,
      userId: data.userId,
      revisionType: data.revisionType,
      contentSnapshot: data.contentSnapshot,
      changeSummary: data.changeSummary,
      version: data.version,
    })
    .returning()
  return revision
}

export async function getRevisions(db: DB, objectId: string) {
  return db
    .select()
    .from(revisions)
    .where(eq(revisions.objectId, objectId))
    .orderBy(desc(revisions.version))
}

// --- References ---

export async function createReference(
  db: DB,
  data: {
    title: string
    authors?: string[]
    source?: string
    url?: string
    doi?: string
    publishYear?: number
    citationFormat?: string
    fullCitation?: string
  },
) {
  const [ref] = await db
    .insert(references)
    .values({
      title: data.title,
      authors: data.authors ?? [],
      source: data.source,
      url: data.url,
      doi: data.doi,
      publishYear: data.publishYear,
      citationFormat: data.citationFormat ?? "apa",
      fullCitation: data.fullCitation,
    })
    .returning()
  return ref
}

export async function getReferences(db: DB, objectId: string) {
  return db
    .select({
      ref: references,
      context: objectReferences.context,
      pageNumber: objectReferences.pageNumber,
      confidence: objectReferences.confidence,
    })
    .from(objectReferences)
    .innerJoin(references, eq(objectReferences.referenceId, references.id))
    .where(eq(objectReferences.objectId, objectId))
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/infrastructure.ts
git commit -m "feat(database): add slugs, aliases, revisions, and references CRUD"
```

---

### Task 7: Wire KnowledgeEngine with DB queries

**Files:**
- Modify: `packages/knowledge-engine/src/index.ts`

**Interfaces:**
- Consumes: `findObjectBySlug`, `findRelations`, `listObjects` from database; `ObjectResult`, `RelationResult` from shared
- Produces: `KnowledgeEngine` with real implementations

- [ ] **Step 1: Rewrite knowledge-engine/src/index.ts**

```ts
import type { ObjectQuery, ObjectResult, RelationQuery, RelationResult } from "@archron/shared"
import type { DB } from "@archron/database"
import { findObjectBySlug, findObjectById, listObjects } from "@archron/database/objects"
import { findRelations, createRelation } from "@archron/database/relationships"

export interface KnowledgeEngineOptions {
  db: DB
  searchEngine?: unknown
  cache?: Map<string, unknown>
}

export class KnowledgeEngine {
  private db: DB
  private searchEngine: unknown
  private cache: Map<string, unknown>

  constructor(options: KnowledgeEngineOptions) {
    this.db = options.db
    this.searchEngine = options.searchEngine
    this.cache = options.cache ?? new Map()
  }

  async getObject(slug: string): Promise<ObjectResult | null> {
    const cached = this.cache.get(`object:${slug}`) as ObjectResult | undefined
    if (cached) return cached

    const obj = await findObjectBySlug(this.db, slug)
    if (obj) {
      this.cache.set(`object:${slug}`, obj)
      return obj
    }

    if (
      this.searchEngine &&
      typeof (this.searchEngine as { search: Function }).search === "function"
    ) {
      const results = await (this.searchEngine as { search: Function }).search({
        term: slug,
        limit: 1,
      })
      if (results?.results?.[0]) {
        const obj = results.results[0] as ObjectResult
        this.cache.set(`object:${slug}`, obj)
        return obj
      }
    }

    return null
  }

  async getRelations(query: RelationQuery): Promise<RelationResult[]> {
    const cacheKey = `relations:${JSON.stringify(query)}`
    const cached = this.cache.get(cacheKey) as RelationResult[] | undefined
    if (cached) return cached

    const results = await findRelations(this.db, query)
    this.cache.set(cacheKey, results)
    return results
  }

  async getBacklinks(objectId: string): Promise<ObjectResult[]> {
    const cacheKey = `backlinks:${objectId}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const relations = await findRelations(this.db, {
      objectId,
      direction: "incoming",
    })
    const sourceIds = relations.map((r) => r.sourceId)
    if (sourceIds.length === 0) {
      this.cache.set(cacheKey, [])
      return []
    }

    const results: ObjectResult[] = []
    for (const id of sourceIds) {
      const obj = await findObjectById(this.db, id)
      if (obj) results.push(obj)
    }

    this.cache.set(cacheKey, results)
    return results
  }

  async getTimeline(limit: number = 20): Promise<ObjectResult[]> {
    const cacheKey = `timeline:${limit}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const results = await listObjects(this.db, {
      types: ["timeline_event"],
      sort: "recent",
      limit,
    })
    this.cache.set(cacheKey, results)
    return results
  }

  async getRecommendations(
    objectId: string,
    limit: number = 5,
  ): Promise<ObjectResult[]> {
    const cacheKey = `recommend:${objectId}:${limit}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const relations = await findRelations(this.db, {
      objectId,
      direction: "both",
    })
    const relatedIds = relations.map((r) =>
      r.sourceId === objectId ? r.targetId : r.sourceId,
    )

    if (relatedIds.length === 0) {
      this.cache.set(cacheKey, [])
      return []
    }

    const results: ObjectResult[] = []
    for (const id of [...new Set(relatedIds)]) {
      const obj = await findObjectById(this.db, id)
      if (obj) results.push(obj)
    }

    results.sort((a, b) => b.backlinkCount - a.backlinkCount)
    const top = results.slice(0, limit)
    this.cache.set(cacheKey, top)
    return top
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }
}

export type { ObjectQuery, ObjectResult, RelationQuery, RelationResult, KnowledgeEngineOptions }
```

- [ ] **Step 2: Add wildcard exports to @archron/database/package.json**

The `@archron/database` package.json must support subpath exports for `@archron/database/objects` and `@archron/database/relationships`. Replace the current `exports` field:

```json
"exports": {
  ".": {
    "types": "./src/index.ts",
    "import": "./src/index.ts"
  },
  "./*": {
    "types": "./src/*.ts",
    "import": "./src/*.ts"
  }
}
```

- [ ] **Step 3: Verify both packages compile**

```bash
pnpm --filter @archron/database typecheck
if ($?) { pnpm --filter @archron/knowledge-engine typecheck }
```

Expected: Both PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/knowledge-engine/src/index.ts packages/database/package.json
git commit -m "feat(knowledge-engine): wire real DB queries via CRUD functions"
```

---

### Task 8: Update database index.ts exports

**Files:**
- Modify: `packages/database/src/index.ts`

- [ ] **Step 1: Add new file exports**

Current content:
```ts
export * from "./schema"
export * from "./triggers"
```

Replace with:
```ts
export * from "./schema"
export * from "./triggers"
export { db } from "./db"
export type { DB } from "./db"
export * from "./objects"
export * from "./relationships"
export * from "./users"
export * from "./social"
export * from "./infrastructure"
```

- [ ] **Step 2: Verify compilation**

```bash
pnpm --filter @archron/database typecheck
```

Expected: PASS.

- [ ] **Step 3: Run full workspace typecheck**

```bash
pnpm typecheck
```

Expected: All packages PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/database/src/index.ts
git commit -m "feat(database): export DB client and all CRUD modules from index"
```

---

## Execution Order

1. Task 0 → Task 1 → Dispatch Tasks 2-6 in parallel → Task 7 → Task 8

Agents to dispatch:
- Agent A: Task 0 (types)
- Agent B: Task 1 (db.ts)
- Agent C: Task 2 (objects.ts)
- Agent D: Task 3 (users.ts)
- Agent E: Task 4 (relationships.ts)
- Agent F: Task 5 (social.ts)
- Agent G: Task 6 (infrastructure.ts)
- Agent H: Task 7 (knowledge-engine)
- Agent I: Task 8 (index.ts exports)

Agents A→B→{C,D,E,F,G}→H→I

**Note:** Tasks 2-6 are independent of each other (all consume `DB` type from Task 1). Task 7 depends on Tasks 2 and 4. Task 8 is the final consolidation.
