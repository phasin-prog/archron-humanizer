# Validation Engine

Before any Draft can be submitted for Review, the Validation Engine runs automatic checks.

## Validation Checks

### Critical (Blocks submission)

| Check | Description |
|-------|-------------|
| Missing Title | Draft must have a title |
| Empty Body | Draft must have content |
| Broken Wikilinks | `[[type:slug]]` references that don't resolve |
| Missing References | Must have at least 1 Reference |
| Duplicate Slug | Slug must be unique across all Objects |
| Invalid Metadata | All required frontmatter fields must be present |

### Warning (Shows alert but does not block)

| Check | Description |
|-------|-------------|
| Short Content | Article < 500 words warning |
| Low Reading Time | < 3 minutes reading time |
| Missing Image Alt | Images without alt text |
| Few References | < 3 references recommended |
| Unlinked Concepts | Inline terms that could be wikilinks |
| Missing Backlinks | Object has no incoming links from other Objects |
| No Related Content | No related Objects found for this Object |

### Info (Suggestion only)

| Check | Description |
|-------|-------------|
| Long Title | > 80 characters |
| Missing Category | Not tagged to any Domain/School |
| No Aliases | Object has no registered aliases |
| Duplicate Suggested | System found possible duplicate Concepts |

## Validation Interface

```
┌─────────────────────────────────────────────┐
│  Validation Results                          │
│                                             │
│  ❌ 2 Critical Issues                         │
│   └── Missing References (add at least 1)    │
│   └── Broken wikilink: [[thinker:unknown]]   │
│                                             │
│  ⚠️ 3 Warnings                               │
│   └── Low reading time (2 min)              │
│   └── No image alt text                     │
│   └── 5 unlinked concepts found             │
│                                             │
│  ℹ️ 2 Suggestions                            │
│   └── Add aliases for better search         │
│   └── Possible duplicate: "Shadow (archetype)"│
│                                             │
│  [Fix Issues]  [View All]                   │
└─────────────────────────────────────────────┘
```

## Validation Rules

- Validation runs automatically on "Submit for Review"
- Writer can also trigger validation manually via `/validate` command
- Critical issues must be resolved before submission
- Warnings are logged but do not block — Reviewer will see them
- Suggestions are informational only
- Validation results are attached to the Draft and visible to Reviewer
