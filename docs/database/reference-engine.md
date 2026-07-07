# Reference Engine

A Reference is not a Markdown footnote. It is structured bibliographic data.

## Reference Table

```
references
├── id (UUID, PK)
├── object_type (VARCHAR)     -- 'book', 'article', 'web', 'thesis', etc.
├── citation_key (VARCHAR)    -- Unique key for inline citation (e.g., "Jung1964")
├── title (VARCHAR)
├── authors (JSONB)           -- [{ name, role }]
├── year (INTEGER)
├── publisher (VARCHAR)
├── doi (VARCHAR, NULLABLE)
├── isbn (VARCHAR, NULLABLE)
├── url (VARCHAR, NULLABLE)
├── accessed_at (DATE)        -- For web sources
├── pages (VARCHAR, NULLABLE) -- "45-67" or "xii + 320"
├── edition (VARCHAR, NULLABLE)
├── volume (VARCHAR, NULLABLE)
├── issue (VARCHAR, NULLABLE)
├── citation_data (JSONB)     -- Pre-formatted citations: { "apa": "...", "mla": "..." }
├── created_by (FK → users)
├── created_at
└── updated_at

object_references
├── object_id (UUID, FK → objects)
├── reference_id (UUID, FK → references)
├── relevance (ENUM: primary, supporting, contextual)
├── page (VARCHAR, NULLABLE)  -- Specific page referenced
├── note (TEXT, NULLABLE)
└── created_at
```

## Reference Resolution

When a Writer adds `[[reference:Jung1964]]` in Markdown:

```
[[reference:Jung1964]]
    │
    ▼
Knowledge Engine
    │
    ├── Lookup citation_key = "Jung1964" in references table
    ├── Return structured data (title, authors, year, doi)
    │
    ▼
Renderer
    │
    ├── Render as inline citation badge: (Jung, 1964)
    ├── Footer: full formatted reference
    └── Link: DOI or URL if available
```

## Auto-fetch

When a Writer provides a DOI or ISBN, the system auto-fetches metadata:

```
Input: DOI 10.1000/xyz123
    │
    ▼
Auto-fetch Service (via Crossref API / OpenLibrary)
    │
    ├── title, authors, year, publisher, pages
    └── Pre-fill reference form
```

## Citation Formats

The Renderer supports multiple citation styles:

| Style | Example |
|-------|---------|
| APA | Jung, C. G. (1964). *Man and His Symbols*. Doubleday. |
| MLA | Jung, Carl Gustav. *Man and His Symbols*. Doubleday, 1964. |
| Chicago | Jung, Carl Gustav. 1964. *Man and His Symbols*. New York: Doubleday. |
| IEEE | [1] C. G. Jung, *Man and His Symbols*. Doubleday, 1964. |

The citation format is determined by the Reader's preference or page context (academic mode).

## Rules

- Every published Article must have at least 1 Reference
- References are globally shared — one reference can support many Objects
- Duplicate DOI/ISBN detection prevents duplicate entries
- References are immutable once linked to a published Object
- Unlinked references (no Object association) can be edited
- Renderer caches citation data for fast page generation
