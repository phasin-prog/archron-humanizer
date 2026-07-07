# Database

## Stack

- **Provider:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Extensions:** PL/pgSQL for advanced operations

## PL/pgSQL Usage

PL/pgSQL is used for system-level operations that must run inside the database:

| Operation | Description |
|-----------|-------------|
| Trigger | Auto-update `updated_at` on row changes |
| Slug | Auto-generate slug from title on insert |
| Backlink | Recalculate backlinks when relationships change |
| Audit | Log all state transitions (Draft → Review → Published) |
| Version | Preserve previous version on publish |
| Statistics | Cache read counts, relationship counts for performance |

## Schema Principles

- Every table has: `id` (UUID), `created_at`, `updated_at`
- Soft deletes preferred over hard deletes (use `deleted_at` timestamp)
- Relationships use foreign keys with indexes
- Polymorphic associations use `object_type` + `object_id` pattern
- Full-text search indexes on `title`, `description`, and `content` columns
- All queries are parameterized — no string interpolation in SQL

## Key Tables (Initial)

```
users, profiles, roles
objects (polymorphic base)
concepts, thinkers, theories, schools, disciplines
books, articles, symbols, quotes
timeline_events
references, media
collections, collection_items
guides, guide_lessons
drafts, versions
comments
achievements, user_achievements
notifications
```

## Migration Strategy

- All schema changes via Drizzle migrations
- Migrations are versioned and committed to the repo
- No manual database changes — every change must have a migration
- Rollback support for all migrations
