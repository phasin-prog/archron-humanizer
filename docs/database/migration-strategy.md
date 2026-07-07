# Migration Strategy

## Principles

- All schema changes are managed via Drizzle migrations
- No manual database changes — every change has a migration file
- Migrations are versioned and committed to the repository
- Rollback support for every migration
- Migrations are tested against a staging database before production

## Workflow

```
Schema Change Needed
    │
    ▼
Edit Drizzle Schema (schema.ts)
    │
    ▼
Generate Migration: `npx drizzle-kit generate`
    │
    ▼
Review Migration SQL
    │
    ▼
Apply to Staging: `npx drizzle-kit migrate`
    │
    ▼
Test in Staging
    │
    ├── Pass → Apply to Production
    │
    └── Fail → Fix → Regenerate
```

## Migration Conventions

| Convention | Rule |
|------------|------|
| Naming | `YYYYMMDD_HHMM_description.sql` |
| Content | One logical change per migration |
| Reversible | Each migration has an `up` and `down` |
| Idempotent | Migrations use `IF NOT EXISTS` / `IF EXISTS` |
| Reviewable | Every migration SQL is code-reviewed |
| Seed data | Separate seed files, not in migrations |

## Migration Types

### Major Migrations
- New tables, column additions, constraint changes
- Requires: review + test on staging
- Rollback: full reverse migration

### Data Migrations
- Backfill columns, transform data, merge records
- Requires: dry-run on staging + backup
- Rollback: restore from backup

### Index Migrations
- Add/remove indexes for performance
- Requires: concurrent indexing in production
- Rollback: drop index

## Seed Data

Seed files are separate from migrations:

```
database/seeds/
├── 01-roles.sql
├── 02-disciplines.sql
├── 03-schools.sql
├── 04-admin-user.sql
└── 05-sample-data.sql
```

Seeds are run in order after migrations complete.

## Production Migration Rules

- Migrations run in CI/CD pipeline — never manual on production
- Production migrations are applied during low-traffic windows
- Long-running migrations use `CONCURRENTLY` for index creation
- Migration failure triggers automated rollback
- Database is backed up before any production migration
- Read replicas are used during migration (future)
- Zero-downtime migrations preferred — avoid table locks
