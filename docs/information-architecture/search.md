# Search Strategy

## Searchable Object Types

Users can search for:

- Concept
- Thinker
- Theory
- School
- Book
- Quote
- Article
- Guide
- Timeline Event
- Symbol
- Collection

## Search Capabilities

### Full-Text Search
- Title and description matching
- Content body indexing (for Articles, Guides)
- Quote matching with source attribution

### Alias Search
- Objects registered with aliases (including Thai names)
- Alternate spellings and translations
- Common misspellings

### Faceted Search
- Filter by Domain / School
- Filter by Object type
- Filter by Difficulty level
- Filter by Language
- Sort by Relevance / Date / Title

### Relation Search
- "Show all Concepts related to X"
- "Show all Books by Thinker Y"
- "Show all Timeline Events for Theory Z"

### Autocomplete
- Suggest results as the user types
- Group suggestions by Object type
- Show thumbnails and short descriptions

## Ranking Priority

1. Exact title match
2. Alias match
3. Title substring match
4. Description match
5. Content body match
6. Related Object match

## Search Engine

- Backend: PostgreSQL tsvector (primary) + Supabase
- Future: Semantic search using embeddings
