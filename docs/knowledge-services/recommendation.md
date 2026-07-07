# Recommendation Engine

Milestone 10.2 — Rule-based and graph traversal. No AI required.

## Goal

If you read X, you should read Y — automatically.

## Architecture

```
Current Object
    │
    ▼
Knowledge Graph Traversal
    │
    ├── Direct relationships (1 hop)
    ├── Indirect relationships (2 hops)
    └── Shared connections
    │
    ▼
Ranking
    │
    ├── Relationship weight (primary > secondary > tertiary)
    ├── Connection strength (more shared = higher rank)
    └── Object quality (verified > suggested)
    │
    ▼
Related Content
    │
    └── Max 6 items, grouped by type
```

## Recommendation Strategy

### Direct Relationship

```
Reading: "Psychological Types"
    │
    ├── Contains: Extraversion (Concept)
    ├── Contains: Introversion (Concept)
    ├── Created by: Carl Jung (Thinker)
    └── Mentioned in: Man and His Symbols (Book)
```

### Collaborative Filtering (Rule-based)

```
Users who read X also read Y
    │
    ├── Based on shared relationships
    ├── Based on same taxonomy branch
    └── Based on same author/thinker
```

### Taxonomy-Based

```
Object in Analytical Psychology
    │
    ├── Other concepts in the same theory
    ├── Other theories in the same school
    └── Other schools in the same discipline
```

## Recommendation Display

```
Related Content
┌─────────────────────────────────────────────────┐
│                                                 │
│  Concepts                                        │
│  ├── 🧠 Extraversion                             │
│  ├── 🧠 Introversion                             │
│  └── 🧠 Psychological Types (Theory)             │
│                                                 │
│  Thinkers                                        │
│  ├── 👤 Carl Jung                                │
│  └── 👤 Marie-Louise von Franz                   │
│                                                 │
│  Books                                           │
│  ├── 📖 Man and His Symbols                      │
│  └── 📖 The Red Book                             │
│                                                 │
│  Articles                                        │
│  ├── 📄 Understanding Psychological Types        │
│  └── 📄 Introversion in the Digital Age          │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Implementation (No AI)

```sql
-- Direct relationships
SELECT target_id, target_type, relation_type, weight
FROM relationships
WHERE source_id = :object_id
  AND confidence = 'verified'
ORDER BY weight DESC;

-- Shared connections (users who viewed X also viewed Y)
SELECT r2.target_id, COUNT(*) AS strength
FROM relationships r1
JOIN relationships r2 ON r1.target_id = r2.source_id
WHERE r1.source_id = :object_id
  AND r2.target_id != :object_id
GROUP BY r2.target_id
ORDER BY strength DESC
LIMIT 6;
```

## Acceptance Criteria

- [ ] Every Object page shows related content
- [ ] Related content is grouped by type
- [ ] Direct relationships appear before indirect
- [ ] Related content updates when new relationships are added
- [ ] No dead ends — every page has at least 2 recommendations
- [ ] Recommendation latency < 50ms (graph query only)
