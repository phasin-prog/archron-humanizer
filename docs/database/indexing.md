# Indexing

Separate the search index from the live data for performance.

## Full-Text Search Index

### Primary Index (PostgreSQL tsvector)

```sql
-- On the objects table
ALTER TABLE objects ADD COLUMN search_vector TSVECTOR;

-- Auto-update via trigger
CREATE FUNCTION fn_update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- GIN index for fast search
CREATE INDEX idx_objects_search ON objects USING GIN(search_vector);
```

### Thai Language Support

```sql
-- Trigram-based matching for Thai
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_objects_title_trgm ON objects USING GIN (title gin_trgm_ops);
CREATE INDEX idx_objects_description_trgm ON objects USING GIN (description gin_trgm_ops);
CREATE INDEX idx_aliases_alias_trgm ON aliases USING GIN (alias gin_trgm_ops);
```

### Search Query

```sql
SELECT id, slug, title, object_type, description,
  ts_rank(search_vector, query) AS rank
FROM objects, plainto_tsquery('simple', :query) query
WHERE search_vector @@ query
  AND status = 'published'
ORDER BY rank DESC
LIMIT 20;
```

## Search Index Tables

For more complex search, a separate set of indexed tables:

```
search_index
├── id (UUID, PK)
├── object_id (UUID, FK → objects)
├── object_type (VARCHAR)
├── title (VARCHAR)
├── description (VARCHAR)
├── content (TEXT)           -- Full body text for Articles
├── aliases (TEXT[])         -- Aggregated aliases
├── tags (VARCHAR[])         -- Aggregated tags
├── domain (VARCHAR[])
├── difficulty (VARCHAR)
├── language (VARCHAR)
├── status (VARCHAR)
├── vector (TSVECTOR)
├── updated_at
└── last_indexed_at
```

This table is updated via trigger on Object publish/update and rebuilt on schedule.

## Index Maintenance

| Task | Frequency | Method |
|------|-----------|--------|
| Full reindex | Weekly | `REINDEX INDEX` |
| Stats update | Daily | `ANALYZE` |
| Thai trigram rebuild | Monthly | `REINDEX INDEX idx_objects_title_trgm` |
| Stale index cleanup | Daily | Remove entries for archived/deleted Objects |

## Future: External Search

When PostgreSQL FTS reaches its limit, the `search_index` table can feed into:

```
search_index → ETL → Typesense / Meilisearch
```

The ETL process reads from `search_index` where `updated_at > last_synced_at` and pushes to the external engine. The application switches to the external engine's query API without schema changes.
