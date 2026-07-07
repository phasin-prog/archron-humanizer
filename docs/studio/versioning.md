# Version Control

## Version Model

```
Draft v1 (initial save)
    │
    ▼
Draft v2 (edit)
    │
    ▼
Draft v3 (edit)
    │
    ▼
Review (snapshot at submission)
    │
    ▼
Changes requested → Draft v4
    │
    ▼
Review v2 (re-submission)
    │
    ▼
Published v1 (immutable)
    │
    ▼
Correction → Published v2
    │
    ▼
Published v3
```

## Versioning Rules

- Every save creates a new Draft version
- Versions are numbered sequentially: `v1`, `v2`, `v3`
- Versions are preserved indefinitely (no auto-deletion)
- When a Draft enters Review, a snapshot is taken
- Reviewers see the snapshot — not ongoing edits
- If changes are requested, the Draft forks a new version chain
- Published versions are immutable — cannot be edited or deleted
- Corrections create a new Published version with a change log entry

## Version History UI

```
Version History for "The Shadow"
┌─────────────────────────────────────────────┐
│  ● Published v2 (current)  2024-06-15       │
│   └── Minor corrections                     │
│                                             │
│  ● Published v1            2024-06-10       │
│   └── Initial publish                       │
│                                             │
│  ● Review v1               2024-06-08       │
│   └── Snapshot at submission                │
│                                             │
│  ○ Draft v4                2024-06-07       │
│  ○ Draft v3                2024-06-06       │
│  ○ Draft v2                2024-06-05       │
│  ○ Draft v1                2024-06-04       │
│                                             │
│  [Restore]  [Diff]  [View]                  │
└─────────────────────────────────────────────┘
```

## Diff View

- Side-by-side or unified view
- Highlight added, removed, and changed lines
- Word-level diff for prose (not just line-level)
- Metadata diff (title, description, references changed?)
- Knowledge diff (which relationships changed?)
