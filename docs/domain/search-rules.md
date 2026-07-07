# Search Rules

## 2.8 Search Pipeline

```
User Query
    │
    ▼
Query Processor
    │
    ├── Tokenize
    ├── Stemming
    ├── Stop word removal
    └── Synonym expansion
    │
    ▼
Index Lookup
    │
    ├── Full-text (PostgreSQL tsvector)
    ├── Alias index
    └── Tag/domain filter
    │
    ▼
Result Ranker
    │
    ├── Exact title match      (weight: 100)
    ├── Alias match            (weight: 80)
    ├── Title substring match  (weight: 60)
    ├── Description match      (weight: 40)
    ├── Content body match     (weight: 20)
    └── Related object match   (weight: 10)
    │
    ▼
Results
    └── Grouped by Object type
```

## Search Rules

- Results are grouped by Object type with type headers
- Empty queries return trending / popular Objects
- Minimum query length: 2 characters
- Maximum results per page: 20
- Pagination via cursor (not offset) for performance
- Thai language queries: edge-gram tokenization for subword matching
- Aliases are matched case-insensitively
- Archived Objects are excluded from search results
- Drafts are excluded from search results
- Published Objects only — Reviews are not searchable

## Autocomplete Rules

- Triggered after 2 characters
- Max 8 suggestions
- Group suggestions by type with icon
- Priority: exact match > prefix match > substring match
- Recent searches shown when input is empty (logged-in users only)
