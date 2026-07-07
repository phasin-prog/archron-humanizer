# Search

## Strategy

Start with PostgreSQL Full-Text Search. Scale to a dedicated search engine when query volume and complexity demand it.

## Phase 1: PostgreSQL Full-Text Search

```
SELECT * FROM objects
WHERE objects.search_vector @@ plainto_tsquery('english', :query)
ORDER BY ts_rank(objects.search_vector, plainto_tsquery('english', :query)) DESC
```

- `search_vector` is a generated tsvector column combining `title`, `description`, and `content`
- Thai language support via `pg_trgm` extension for trigram similarity matching
- Alias matching via a separate `aliases` table with trigram indexes
- Faceted filtering via WHERE clauses on `type`, `domain`, `difficulty`

## Phase 2: Dedicated Search Engine

Future migration path:

```
PostgreSQL FTS
    │
    ▼ (when needed)
Typesense / Meilisearch
    │
    ├── Faster typo-tolerant search
    ├── Better relevance ranking
    └── Lower database load
```

## Search Index

| Index | Content | Update Strategy |
|-------|---------|-----------------|
| Objects | title, description, content | On publish / update |
| Aliases | all alias strings | On alias create / update |
| Tags | tag names | On tag create / update |

## Search API

```
Search(query, filters)
    │
    ├── query: string (min 2 chars)
    ├── type: Concept | Thinker | Book | ...
    ├── domain: Psychology | Philosophy | ...
    ├── difficulty: beginner | intermediate | advanced
    ├── sort: relevance | date | title
    ├── limit: number (max 50)
    └── offset: number
    │
    ▼
Results[]
    ├── id, slug, title, type, description
    ├── thumbnail, difficulty, reading_time
    └── match_reason: exact | alias | content
```
