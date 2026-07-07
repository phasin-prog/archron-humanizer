# ARCHRON Integration Layer

สรุปการเชื่อมต่อ code ทั้งหมดเข้าด้วยกัน

## 📦 Package Architecture

```
packages/
├── shared/          → Core types, utilities, integration layer
├── database/        → Drizzle ORM, schema, queries
├── knowledge-engine/→ Business logic layer
├── search/          → Search engine
├── graph/           → Graph visualization
├── editor/          → Markdown editor
├── renderer/        → MDX rendering pipeline
├── auth/            → Clerk authentication
└── ui/              → React components

apps/
├── web/             → Main website (Next.js)
├── studio/          → Content creation (Next.js)
└── admin/           → Admin dashboard (Next.js)
```

## 🔗 Integration Points

### 1. **Shared Package** — ศูนย์กลางทั้งหมด

**Location:** `packages/shared/`

**Exports:**
- `types.ts` — Type definitions shared across all packages
- `constants.ts` — Shared constants
- `utils.ts` — Common utilities
- `integration.ts` — Service initialization & context
- `api.ts` — API route helpers
- `hooks.ts` — React hooks for data fetching

**Usage:**
```typescript
import {
  ObjectResult,
  getServiceContext,
  useObject,
  withServices
} from "@archron/shared"
```

### 2. **Service Context Pattern**

**Initialize services:**
```typescript
// In app initialization
import { initializeServices } from "@archron/shared"

const services = await initializeServices({
  databaseUrl: process.env.DATABASE_URL
})
```

**Use in API routes:**
```typescript
import { withServices, apiSuccess } from "@archron/shared"

export const GET = withServices(async (req, ctx) => {
  const object = await ctx.getObject("some-slug")
  return apiSuccess(object)
})
```

**Use in Server Components:**
```typescript
import { getServiceContext } from "@archron/shared"

export default async function Page() {
  const ctx = await getServiceContext()
  const object = await ctx.getObject("some-slug")
  return <div>{object.title}</div>
}
```

### 3. **Client-Side Hooks**

**In React components:**
```typescript
"use client"

import { useObject, useSearch, useBacklinks } from "@archron/shared"

function MyComponent() {
  const { data, loading } = useObject("some-slug")
  const { term, search, data: results } = useSearch()
  const { data: backlinks } = useBacklinks("some-slug")
  
  return <div>...</div>
}
```

### 4. **API Routes Created**

All routes use `withServices()` wrapper for automatic service injection:

- `GET /api/objects/[slug]` — Get object by slug
- `GET /api/objects/[slug]/backlinks` — Get backlinks
- `GET /api/objects/[slug]/relations` — Get relations
- `GET /api/objects/[slug]/recommendations` — Get recommendations
- `GET /api/search?q=term` — Search objects

### 5. **Database Layer**

**Direct database access:**
```typescript
import { db } from "@archron/database"
import { findObjectBySlug, listObjects } from "@archron/database"

const obj = await findObjectBySlug(db, "some-slug")
const list = await listObjects(db, { types: ["concept"] })
```

**Through service context (recommended):**
```typescript
const ctx = await getServiceContext()
const obj = await ctx.getObject("some-slug")
```

### 6. **Knowledge Engine**

Encapsulates business logic:
```typescript
const ctx = await getServiceContext()

// Get object with caching
const obj = await ctx.knowledge.getObject("slug")

// Get relations
const relations = await ctx.knowledge.getRelations({ 
  objectId: "id",
  direction: "both" 
})

// Get backlinks
const backlinks = await ctx.knowledge.getBacklinks("id")

// Get recommendations
const recs = await ctx.knowledge.getRecommendations("id", 5)
```

### 7. **Search Engine**

```typescript
const ctx = await getServiceContext()

const results = await ctx.search.search({
  term: "jung",
  types: ["concept", "thinker"],
  limit: 20
})
```

### 8. **Component Integration**

**UI Package exports:**
```typescript
import { 
  Button, 
  Card, 
  KnowledgeCard,
  ConceptIcon 
} from "@archron/ui"
```

**Use in apps:**
```typescript
import { KnowledgeCard } from "@archron/ui"

<KnowledgeCard
  type="concept"
  title="The Shadow"
  description="..."
/>
```

## 🚀 Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Set up environment
```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### 3. Run development
```bash
pnpm dev
```

### 4. Build all packages
```bash
pnpm build
```

## 🎯 Usage Patterns

### Pattern 1: Server Component with Data
```typescript
// app/concepts/[slug]/page.tsx
import { getServiceContext } from "@archron/shared"
import { KnowledgeCard } from "@archron/ui"

export default async function ConceptPage({ params }: { params: { slug: string } }) {
  const ctx = await getServiceContext()
  const concept = await ctx.getObject(params.slug)
  const backlinks = await ctx.getBacklinks(concept.id)
  
  return (
    <div>
      <h1>{concept.title}</h1>
      <div>
        {backlinks.map(link => (
          <KnowledgeCard key={link.id} {...link} />
        ))}
      </div>
    </div>
  )
}
```

### Pattern 2: Client Component with Hooks
```typescript
"use client"

import { useObject, useBacklinks } from "@archron/shared"
import { KnowledgeCard } from "@archron/ui"

export function ConceptView({ slug }: { slug: string }) {
  const { data: concept, loading } = useObject(slug)
  const { data: backlinks } = useBacklinks(slug)
  
  if (loading) return <div>Loading...</div>
  if (!concept) return <div>Not found</div>
  
  return (
    <div>
      <h1>{concept.title}</h1>
      <div>
        {backlinks.map(link => (
          <KnowledgeCard key={link.id} {...link} />
        ))}
      </div>
    </div>
  )
}
```

### Pattern 3: API Route Handler
```typescript
// app/api/custom/route.ts
import { withServices, apiSuccess, apiError } from "@archron/shared"

export const GET = withServices(async (req, ctx) => {
  try {
    const data = await ctx.knowledge.getTimeline(20)
    return apiSuccess(data)
  } catch (error) {
    return apiError("Failed to fetch timeline", 500)
  }
})
```

## 📝 Type Safety

All packages share types from `@archron/shared`:

```typescript
import type {
  ObjectResult,
  ObjectQuery,
  RelationResult,
  SearchResponse,
  UserProfile
} from "@archron/shared"
```

## 🔄 Data Flow

```
User Request
    ↓
Next.js Route/Component
    ↓
ServiceContext (from @archron/shared)
    ↓
┌─────────────────┬──────────────────┐
│ KnowledgeEngine │  SearchEngine    │
└────────┬────────┴────────┬─────────┘
         ↓                 ↓
    Database Layer (@archron/database)
         ↓
    PostgreSQL
```

## ✅ Integration Complete

ทุก package เชื่อมต่อกันผ่าน:
1. **@archron/shared** — Types & utilities
2. **ServiceContext** — Service injection
3. **API routes** — RESTful endpoints
4. **React hooks** — Client-side data fetching
5. **Database layer** — Drizzle ORM queries

Code พร้อมใช้งานครบทุก layer แล้ว!
