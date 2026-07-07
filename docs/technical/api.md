# API Layer

## 3.6 Architecture

```
Browser
    │
    ▼
Server Actions (mutations)
    │
    ▼
Route Handlers (read operations, external)
    │
    ▼
Knowledge Engine
    │
    ▼
Repository Layer
    │
    ▼
Database
```

## Principles

- **Everything goes through the Knowledge Engine** — no direct database calls from routes
- **Server Actions for mutations** — create, update, delete operations
- **Route Handlers for reads** — GET endpoints for search, browse, external access
- **Repository Layer abstracts SQL** — the engine never writes raw queries
- **Input validation at the route layer** — Zod schemas validate all inputs
- **Authorization in the engine layer** — the engine checks permissions before acting

## Server Actions (Mutate)

```
createObject(type, data)        → Draft
updateObject(id, data)          → Draft
submitForReview(id)             → Draft → Review
approveReview(id)               → Review → Published
archiveObject(id)               → Published → Archived
createCollection(userId, data)  → Collection
createGuide(userId, data)       → Guide
uploadMedia(file)               → Media
```

## Route Handlers (Read)

```
GET  /api/search?q=&type=&domain=  → SearchResults
GET  /api/objects/[slug]          → Object
GET  /api/browse/[domain]         → Object[]
GET  /api/timeline?from=&to=      → TimelineEvent[]
GET  /api/graph/[slug]            → GraphData
GET  /api/revalidate/[slug]       → Trigger ISR
```

## External API (Future)

```
GET  /api/v1/objects/[slug]       → JSON Object
GET  /api/v1/search               → JSON SearchResults
POST /api/v1/graph/query          → JSON Graph Data
```
