# Schema Principles

## Universal Rules

### Every Table Has

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key, globally unique across all tables |
| `created_at` | TIMESTAMPTZ | When the row was created |
| `updated_at` | TIMESTAMPTZ | When the row was last updated (auto-updated via trigger) |

### Naming

| Construct | Convention | Example |
|-----------|------------|---------|
| Tables | snake_case, plural | `concepts`, `timeline_events` |
| Columns | snake_case | `reading_time`, `created_at` |
| Foreign keys | `{table}_id` | `user_id`, `object_id` |
| Junction tables | `{table1}_{table2}` | `object_tags`, `collection_items` |
| Indexes | `idx_{table}_{column}` | `idx_objects_slug` |
| Triggers | `trg_{table}_{action}` | `trg_objects_updated_at` |
| Functions | `fn_{purpose}` | `fn_generate_slug` |

### Constraints

- Every table has a primary key on `id`
- Foreign keys are always explicitly named
- Unique constraints cover natural keys (slug, email, etc.)
- NOT NULL on all required fields at the database level
- CHECK constraints for enums and value ranges
- Default values for timestamp and status fields

### Indexes

- All foreign keys are indexed
- All slug columns have a unique index
- All `search_vector` columns use GIN indexes
- All relationship tables have composite indexes on (source_type, source_id) and (target_type, target_id)
- Frequently filtered columns (status, visibility, language, type) are indexed
- JSONB columns use GIN indexes for queryable metadata

## Polymorphic Pattern

For the `objects` table and `relationships` table, polymorphic associations use:

```
source_type  → VARCHAR (table name)
source_id    → UUID (row ID in that table)
```

This allows any Object type to relate to any other Object type without schema changes.

## Soft Deletes

- Use `deleted_at` TIMESTAMPTZ instead of hard DELETE
- Deleted rows excluded from all queries via `WHERE deleted_at IS NULL`
- Soft-deleted rows preserved for 30 days before archival
- Unique constraints include `WHERE deleted_at IS NULL` to allow slug reuse after deletion

## JSONB Usage

JSONB is used only for:

- Flexible metadata that varies per Object type
- Social links in profiles
- Permissions in roles
- Search criteria in achievements

JSONB is NOT used for:

- Relational data (use proper foreign keys)
- Searchable content (use tsvector)
- Frequently queried fields (use indexed columns)
