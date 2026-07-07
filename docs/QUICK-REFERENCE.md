# Quick Reference: ARCHRON Code Integration

## Import What You Need

```typescript
// Types & utilities
import { 
  ObjectResult, 
  ObjectQuery,
  slugify,
  formatDate,
  countWords
} from "@archron/shared"

// Server-side: Service context
import { getServiceContext } from "@archron/shared"

// Server-side: API helpers
import { withServices, apiSuccess, apiError } from "@archron/shared"

// Client-side: React hooks
import { useObject, useSearch, useBacklinks } from "@archron/shared"

// UI components
import { Button, Card, KnowledgeCard } from "@archron/ui"

// Database direct access (if needed)
import { db } from "@archron/database"
import { findObjectBySlug, listObjects } from "@archron/database"
```

## 3 Main Patterns

### 1. Server Component
```typescript
export default async function Page() {
  const ctx = await getServiceContext()
  const data = await ctx.getObject("slug")
  return <div>{data.title}</div>
}
```

### 2. API Route
```typescript
export const GET = withServices(async (req, ctx) => {
  const data = await ctx.getObject("slug")
  return apiSuccess(data)
})
```

### 3. Client Component
```typescript
"use client"
export function Component() {
  const { data, loading } = useObject("slug")
  return <div>{data?.title}</div>
}
```

## Service Context Methods

```typescript
const ctx = await getServiceContext()

ctx.db                              // Direct database access
ctx.knowledge                        // KnowledgeEngine instance
ctx.search                          // SearchEngine instance

await ctx.getObject(slug)           // Get object by slug
await ctx.searchObjects(term, opts) // Search
await ctx.getRelations(objectId)    // Get relations
await ctx.getBacklinks(objectId)    // Get backlinks
await ctx.getRecommendations(id, 5) // Get recommendations
```

## API Endpoints

```
GET /api/objects/[slug]
GET /api/objects/[slug]/backlinks
GET /api/objects/[slug]/relations
GET /api/objects/[slug]/recommendations
GET /api/search?q=term&types=concept,thinker&limit=20
```

## React Hooks

```typescript
const { data, loading, error } = useObject(slug)
const { data, loading, error } = useBacklinks(slug, limit)
const { data, loading, error } = useRecommendations(slug, limit)
const { data, loading, error } = useRelations(slug)
const { term, search, clear, data, loading } = useSearch()
```

Done! ทุก package เชื่อมกันหมดแล้ว
