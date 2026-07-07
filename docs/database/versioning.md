# Versioning

## Philosophy

Data is never overwritten. Every change preserves history.

## Version Model

```
objects: Current published/active state
    │
revisions: All historical versions (immutable)
    │
    └── Each revision stores the complete state at that point
```

## Revision Table

```
revisions
├── id (UUID, PK)
├── object_id (UUID, FK → objects)
├── object_type (VARCHAR)
├── revision_type (ENUM: draft_save, review_submit, review_changes, publish, archive, correction)
├── snapshot (JSONB)      ← Complete object state at this revision
├── diff (JSONB)           ← Changes from previous revision
├── change_summary (TEXT)  ← Human-readable summary
├── created_by (UUID, FK → users)
├── created_at (TIMESTAMPTZ)
└── previous_version (INTEGER)
```

## Versioning Rules

- Creating a new Object creates revision v1
- Every Draft save creates a new revision
- Submit for Review creates a snapshot revision
- Publishing creates a published revision (immutable)
- Corrections create a new published revision with change log
- Revisions are immutable — never updated or deleted
- Only the latest revision can be "active" (referenced by the objects table)
- Rolling back restores a previous revision into the objects table and creates a new revision

## PL/pgSQL Version Trigger

```sql
-- Auto-create revision on object update
CREATE OR REPLACE FUNCTION fn_revision_tracker()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO revisions (object_id, object_type, revision_type, snapshot, created_by)
  VALUES (NEW.id, TG_ARGV[0], 'draft_save', row_to_json(NEW), NEW.updated_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Query Historical State

```sql
-- Get object as it existed at a specific time
SELECT * FROM revisions
WHERE object_id = :id
  AND created_at <= :timestamp
ORDER BY created_at DESC
LIMIT 1;
```

## Storage Consideration

- Revisions are stored as JSONB snapshots (not full table copies)
- Diff is computed on read for display, stored as a preview
- Revisions older than 1 year may be archived to cold storage
- Current active state is always in the objects table for fast access
