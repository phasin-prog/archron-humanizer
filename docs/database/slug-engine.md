# Slug Engine

A slug is not just a string. A slug is an Object.

## Slug Table

```
slugs
├── id (UUID, PK)
├── slug (VARCHAR, UNIQUE)
├── object_type (VARCHAR)
├── object_id (UUID)
├── is_primary (BOOLEAN)
├── is_active (BOOLEAN)
├── created_at
└── updated_at

slug_redirects
├── id (UUID, PK)
├── from_slug (VARCHAR, UNIQUE)
├── to_slug_id (FK → slugs)
├── reason (ENUM: renamed, merged, corrected)
├── created_at
└── expires_at (NULLABLE)
```

## Slug Generation Rules

- Slugs are lowercase, ASCII-only, hyphen-separated
- Generated from title: `"The Shadow"` → `"the-shadow"`
- Non-ASCII characters are transliterated: `"เงา"` → `"ngao"`
- Duplicate slugs append a suffix: `"shadow"`, `"shadow-1"`, `"shadow-2"`
- Slugs are immutable once created — even for Drafts
- Maximum slug length: 200 characters
- Slugs cannot be changed after publish — rename creates redirect

## Slug Engine Responsibilities

| Operation | Behavior |
|-----------|----------|
| Create | Generate slug + check uniqueness + insert |
| Read | Lookup slug → resolve to object or redirect |
| Rename | Create new slug + create redirect from old → new |
| Merge | All slugs from merged object redirect to primary |
| Delete | Soft-delete slug (redirects remain active) |

## Slug Resolution

```sql
-- Resolve a slug to its target object
SELECT s.object_type, s.object_id
FROM slugs s
WHERE s.slug = :slug AND s.is_active = true

UNION ALL

SELECT s.object_type, s.object_id
FROM slug_redirects sr
JOIN slugs s ON s.id = sr.to_slug_id
WHERE sr.from_slug = :slug;
```

## Alias Support

```
aliases
├── id (UUID, PK)
├── slug_id (FK → slugs)
├── alias (VARCHAR)
├── language (VARCHAR)
├── is_searchable (BOOLEAN)
└── created_at
```

Aliases allow discovery via alternate names:

```sql
-- Find object by alias
SELECT object_type, object_id
FROM aliases a
JOIN slugs s ON s.id = a.slug_id
WHERE a.alias = :query AND a.is_searchable = true;
```

## PL/pgSQL Responsibilities

- Auto-generate slug on Object insert
- Check for duplicate slugs before insert
- Create redirect automatically on rename
- Prevent slug reuse for 30 days after soft delete
