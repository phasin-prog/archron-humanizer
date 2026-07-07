# Reading Memory

Milestone 10.4 — Remember where the reader left off.

## Goal

"Continue where you left off" — across devices, across sessions.

## What We Remember

| Data | Scope | Retention |
|------|-------|-----------|
| Last read position | Per Object | Indefinite |
| Reading progress (%) | Per Object | Indefinite |
| Completed Objects | Per user | Indefinite |
| Reading history (timestamps) | Per user | 90 days |
| Search history | Per user | 30 days |
| Started Guides | Per user | Indefinite |
| Completed Guide lessons | Per user | Indefinite |
| Saved Collections | Per user | Indefinite |

## Reading Progress Tracking

```
Object: "The Shadow" (Article)
┌─────────────────────────────────────────────────────┐
│  Reading Progress: ████████░░░░ 68%                 │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                              │    │
│  │  (Content)                                   │    │
│  │                                              │    │
│  │  ████████████████████████████████████████░░  │    │
│  │  ▲ You are here                              │    │
│  │                                              │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [Continue Reading]                                  │
└─────────────────────────────────────────────────────┘
```

## Resume Behavior

| Action | Result |
|--------|--------|
| Return to an Object | Scroll to last read position |
| Open a Guide | Open the last uncompleted lesson |
| Open a Collection | Show last viewed position |
| Search | Restore recent searches |
| Cross-device | Sync reading position within 5 seconds |

## Implementation (No AI)

```typescript
interface ReadingProgress {
  userId: string
  objectId: string
  objectType: ObjectType
  scrollPosition: number      // 0.0 to 1.0
  percentage: number          // 0 to 100
  completed: boolean
  lastReadAt: timestamp
  device: string
}
```

Storage:

- PostgreSQL: `reading_progress` table
- Indexed by (user_id, object_id) — unique
- Updated every 30 seconds during reading
- Debounced update on scroll stop

```sql
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  object_id UUID REFERENCES objects(id),
  object_type VARCHAR NOT NULL,
  scroll_position FLOAT NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device VARCHAR,
  UNIQUE(user_id, object_id)
);
```

## Resume Entry Points

| Location | Shows |
|----------|-------|
| Homepage | "Continue Reading: The Shadow — 68%" |
| Object page | Scroll to last position automatically |
| Guide page | "Continue Lesson 4" |
| Search | Recent searches below search bar |
| Profile | Reading history tab |

## Acceptance Criteria

- [ ] Reading position is saved within 30 seconds
- [ ] Returning to an Object scrolls to last position
- [ ] Progress bar shows accurate percentage
- [ ] Cross-device sync works within 5 seconds
- [ ] Reading history is available for 90 days
- [ ] Completed Objects are marked separately
