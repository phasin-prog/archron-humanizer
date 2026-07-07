# Entity Model

## Design Principle

Design according to **meaning**, not according to **screen**.

## Universal Object Model

Every knowledge Object shares a common base:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, globally unique |
| `slug` | VARCHAR | URL-safe immutable identifier (via Slug Engine) |
| `title` | VARCHAR | Display title |
| `status` | ENUM | draft / review / published / archived |
| `visibility` | ENUM | public / private / unlisted |
| `language` | VARCHAR | ISO 639-1 code (th, en, etc.) |
| `description` | TEXT | Short summary (max 280 chars) |
| `search_vector` | TSVECTOR | Auto-generated full-text index |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |
| `version` | INTEGER | Monotonic version counter |

## Entity Groups

### Identity

```
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── encrypted_password
├── role_id (FK → roles)
├── created_at
└── updated_at

profiles
├── id (UUID, PK)
├── user_id (FK → users, UNIQUE)
├── display_name
├── bio
├── avatar_url
├── website
└── social_links (JSONB)

roles
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
├── permissions (JSONB)
├── created_at
└── updated_at
```

### Knowledge

All knowledge entities inherit from the Universal Object Model via a polymorphic pattern:

```
objects
├── id (UUID, PK)
├── slug_id (FK → slugs)
├── object_type (ENUM: concept, thinker, book, article, theory, school, discipline, symbol, quote, timeline_event)
├── title
├── status
├── visibility
├── language
├── description
├── search_vector
├── created_at
├── updated_at
└── version
```

Type-specific data stored in separate tables:

```
concepts
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── definition (TEXT)
├── etymology (TEXT)
├── difficulty (ENUM)
└── reading_time (INTEGER)

thinkers
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── birth_year (INTEGER)
├── death_year (INTEGER)
├── nationality (VARCHAR)
├── image_url (VARCHAR)
├── biography (TEXT)
└── reading_time (INTEGER)

books
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── publication_year (INTEGER)
├── isbn (VARCHAR)
├── original_title (VARCHAR)
├── pages (INTEGER)
├── publisher (VARCHAR)
├── summary (TEXT)
└── reading_time (INTEGER)

articles
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── body_markdown (TEXT)
├── body_html (TEXT)
├── reading_time (INTEGER)
├── difficulty (ENUM)
├── author_id (FK → users)
└── published_at (TIMESTAMPTZ)

theories
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── definition (TEXT)
├── overview (TEXT)
├── school_id (FK → schools)
├── difficulty (ENUM)
└── reading_time (INTEGER)

schools
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── definition (TEXT)
├── historical_context (TEXT)
├── discipline_id (FK → disciplines)
├── difficulty (ENUM)
└── reading_time (INTEGER)

disciplines
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── definition (TEXT)
├── icon (VARCHAR)
└── reading_time (INTEGER)

symbols
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── image_url (VARCHAR)
├── meaning (TEXT)
├── origin (TEXT)
├── cultural_context (TEXT)
├── difficulty (ENUM)
└── reading_time (INTEGER)

quotes
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── quote_text (TEXT)
├── source_id (FK → books)
├── page (INTEGER)
├── context (TEXT)
└── thinker_id (FK → thinkers)

timeline_events
├── id (UUID, PK)
├── object_id (FK → objects, UNIQUE)
├── event_date (VARCHAR)
├── date_precision (ENUM: year, month, day)
├── significance (TEXT)
└── reading_time (INTEGER)
```

### Publishing

```
drafts
├── id (UUID, PK)
├── user_id (FK → users)
├── object_type (VARCHAR)
├── title (VARCHAR)
├── body (TEXT)
├── metadata (JSONB)
├── status (ENUM: draft, review, changes_requested, approved, published)
├── reviewer_id (FK → users, NULLABLE)
├── review_note (TEXT)
├── created_at
├── updated_at
└── version (INTEGER)

revisions
├── id (UUID, PK)
├── draft_id (FK → drafts)
├── object_id (FK → objects, NULLABLE)
├── body (TEXT)
├── metadata (JSONB)
├── change_summary (TEXT)
├── created_by (FK → users)
├── created_at
└── version (INTEGER)
```

### Community

```
comments
├── id (UUID, PK)
├── object_id (FK → objects)
├── user_id (FK → users)
├── parent_id (FK → comments, NULLABLE)
├── text (TEXT)
├── resolved (BOOLEAN)
├── created_at
└── updated_at

collections
├── id (UUID, PK)
├── user_id (FK → users)
├── title (VARCHAR)
├── description (TEXT)
├── visibility (ENUM)
├── created_at
└── updated_at

collection_items
├── collection_id (FK → collections)
├── object_id (FK → objects)
├── order (INTEGER)
├── note (TEXT)
├── added_at
└── PRIMARY KEY (collection_id, object_id)

achievements
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
├── description (TEXT)
├── icon (VARCHAR)
├── criteria (JSONB)
└── created_at

user_achievements
├── user_id (FK → users)
├── achievement_id (FK → achievements)
├── earned_at
└── PRIMARY KEY (user_id, achievement_id)
```

### Media

```
assets
├── id (UUID, PK)
├── object_id (FK → objects, NULLABLE)
├── user_id (FK → users)
├── type (ENUM: image, audio, video, document)
├── filename (VARCHAR)
├── mime_type (VARCHAR)
├── size (INTEGER)
├── url (VARCHAR)
├── alt_text (VARCHAR)
├── width (INTEGER)
├── height (INTEGER)
├── created_at
└── updated_at
```

### System

```
tags
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
└── created_at

object_tags
├── object_id (FK → objects)
├── tag_id (FK → tags)
└── PRIMARY KEY (object_id, tag_id)

domains
├── object_id (FK → objects)
├── domain (VARCHAR)
└── PRIMARY KEY (object_id, domain)
```
