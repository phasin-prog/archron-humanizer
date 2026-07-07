# Knowledge Manager

Not a file manager. A **Concept Registry**.

This is the heart of Studio — where knowledge structure is managed.

## Capabilities

### Concept Registry
- List all Concepts in the system
- Filter by Domain / School / Status
- Search by name, alias, description
- Sort by created, updated, linked count
- Bulk operations: tag, link, archive

### Relationship Editor
- Visual graph of connections
- Drag to create relationships
- Type selector for relationship kind (related, opposes, derives_from)
- Weight selector (primary, secondary, tertiary)

### Backlink Viewer
- Every Object shows what links to it
- Count of backlinks displayed in list
- Unlinked references — Objects mentioned but not linked
- Suggested links — AI/human proposed connections

### Alias Manager
- Add / edit / remove aliases per Object
- Bulk alias import
- Language-specific aliases (th, en, etc.)
- Duplicate alias detection

### Reference Manager
- Add / edit / remove academic References
- DOI / ISBN auto-fetch metadata
- Citation formatting (APA, MLA, Chicago)
- Reference health — broken link checker

### Merge / Split
- **Merge** — combine duplicate Concepts into one
  - Select primary Concept
  - Select secondary Concept(s)
  - System shows conflicts to resolve
  - All relationships merge automatically
  - Backlinks redirect to primary
- **Split** — divide one Concept into two
  - Select Concept to split
  - Define new Concept name
  - Manually assign relationships

### Duplicate Detection
- System scans for similar titles and aliases
- Flagged duplicates shown in review queue
- Auto-suggest merges based on:
  - Identical titles
  - Shared aliases
  - High relationship overlap
  - Similar descriptions

## Knowledge Manager Rules

- Changes in Knowledge Manager are versioned — no accidental data loss
- Merges are reversible for 30 days (soft delete on secondary)
- Duplicate detection runs on schedule (daily) and on publish
- Relationship changes trigger backlink recalculation
- Missing references are flagged but not blocked
