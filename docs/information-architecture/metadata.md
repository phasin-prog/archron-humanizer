# Metadata

Every Object carries standard metadata.

## Shared Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | yes | Unique URL-safe identifier |
| `title` | string | yes | Display title |
| `status` | enum | yes | draft / review / published / archived |
| `aliases` | string[] | no | Alternate names or search terms |
| `language` | enum | yes | Content language (th, en, etc.) |
| `difficulty` | enum | yes | beginner / intermediate / advanced |
| `reading_time` | integer | yes | Estimated reading time in minutes |
| `created_at` | timestamp | yes | Creation timestamp |
| `updated_at` | timestamp | yes | Last update timestamp |
| `version` | integer | yes | Monotonic version counter |
| `author` | reference | yes | Writer who created the Object |
| `editor` | reference | no | Editor who last approved changes |
| `references` | reference[] | no | Academic sources supporting content |
| `domains` | string[] | yes | Domain tags (see taxonomy) |
| `tags` | string[] | no | Free-form tags for discovery |
| `thumbnail` | url | no | Preview image |
| `description` | string | yes | Short summary (<= 280 chars) |

## Type-specific Fields

### Concept
| Field | Type | Description |
|-------|------|-------------|
| `definition` | text | One-sentence precise definition |
| `etymology` | text | Origin of the term |
| `originator` | reference | Thinker who coined the Concept |

### Thinker
| Field | Type | Description |
|-------|------|-------------|
| `birth_year` | integer | Year of birth |
| `death_year` | integer | Year of death (null if alive) |
| `nationality` | string | Cultural/national identity |
| `image` | url | Portrait or photo |

### Book
| Field | Type | Description |
|-------|------|-------------|
| `publication_year` | integer | Year of first publication |
| `isbn` | string | ISBN identifier |
| `original_title` | string | Title in original language |
| `pages` | integer | Page count |

### Timeline Event
| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Date (can be partial: "1895" or "1900-06") |
| `date_precision` | enum | year / month / day |

### Quote
| Field | Type | Description |
|-------|------|-------------|
| `source` | reference | Book or Article the quote comes from |
| `page` | integer | Page number |
| `context` | text | Situational context of the quote |
