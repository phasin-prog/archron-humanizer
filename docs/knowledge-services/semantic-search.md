# Semantic Search

Milestone 10.1 — Foundation level. No AI required.

## Goal

Search finds meaning, not just exact text.

"Shadow" → "เงา" → "Shadow Archetype" → "Schatten" → "The Shadow (Jung)"

## Architecture

```
User Query
    │
    ▼
Query Processor
    │
    ├── Tokenization (language-aware)
    ├── Stemming / Lemmatization
    ├── Stop word removal
    ├── Synonym expansion
    └── Alias lookup
    │
    ▼
Search Index
    │
    ├── PostgreSQL tsvector (title + description + content)
    ├── pg_trgm (Thai substring matching)
    ├── Alias index
    └── Full-text ranking
    │
    ▼
Results
    │
    ├── Ranked by relevance
    └── Grouped by Object type
```

## Search Features

### Synonym Expansion
Automatically expand query with registered synonyms:

| Query | Expands To |
|-------|------------|
| "shadow" | shadow, dark side, unconscious aspect |
| "self" | self, das Selbst, whole psyche |
| "archetype" | archetype, primordial image, universal pattern |

Synonyms are stored in the Alias system — no external API required.

### Multilingual Search
- Thai: edge-gram tokenization via `pg_trgm`
- English: built-in `tsvector` with stemming
- Every alias is tagged with a language
- Query applied across all languages (user can filter by language)

### Type-Aware Ranking
```
Exact title match       → weight: 100
Alias match            → weight: 80
Title prefix match     → weight: 60
Description match      → weight: 40
Content body match     → weight: 20
Tag match              → weight: 10
```

### Faceted Filters
Applied after search:

- Object type (Concept, Thinker, Book, etc.)
- Domain (Psychology, Philosophy, etc.)
- Difficulty (beginner, intermediate, advanced)
- Language
- Status (published only by default)

## Implementation (No AI)

```sql
-- Core search query
SELECT o.id, o.slug, o.title, o.object_type,
       ts_rank(o.search_vector, query) AS rank
FROM objects o,
     plainto_tsquery('simple', :query) query
WHERE o.search_vector @@ query
  AND o.status = 'published'
ORDER BY rank DESC
LIMIT 20;

-- Thai fallback with trigram
SELECT o.id, o.slug, o.title, o.object_type,
       similarity(o.title, :query) AS rank
FROM objects o
WHERE o.title % :query
  AND o.status = 'published'
ORDER BY rank DESC
LIMIT 20;
```

## Acceptance Criteria

- [ ] Search returns relevant results for partial matches
- [ ] Thai language search works with subword matching
- [ ] Aliases resolve to correct Objects
- [ ] Filters narrow results correctly
- [ ] Empty query shows trending / recent content
- [ ] Search latency < 200ms for typical queries
