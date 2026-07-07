# Knowledge Graph Navigation

Milestone 10.5 — Click to explore. Like Wikipedia, but connected.

## Goal

Turn the relationship data into an explorable interface.

## Navigation Model

```
Current Object
    │
    ▼
Connected Objects (1 hop)
    │
    ├── Related Concepts
    ├── Associated Thinkers
    ├── Referenced Books
    ├── Appearing Articles
    └── Timeline Events
    │
    ▼
Each connected Object is clickable
    │
    ▼
Navigate to that Object
    │
    ▼
Show its connections
    │
    ▼
Infinite traversal
```

## Graph Navigation UI

### Inline Graph (on every Object page)

```
┌─────────────────────────────────────────────────────┐
│  Knowledge Connections                                │
│                                                     │
│  Concepts (4)                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ Persona      │→│ Shadow       │→│ Anima        │ │
│  │ Related      │ │ (current)    │ │ Related      │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ Self         │ │ Individuation│                  │
│  │ Related      │ │ Goal         │                  │
│  └──────────────┘ └──────────────┘                  │
│                                                     │
│  Thinkers (2)                                        │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ Carl Jung    │ │ Marie von    │                  │
│  │ Created      │ │ Franz        │                  │
│  └──────────────┘ └──────────────┘                  │
│                                                     │
│  [Explore Full Graph →]                              │
└─────────────────────────────────────────────────────┘
```

### Full Graph Page

```
┌─────────────────────────────────────────────────────┐
│  Knowledge Graph                                      │
│  Focus: Shadow (Concept)                              │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │                                              │   │
│  │        💡 Persona                            │   │
│  │          \                                   │   │
│  │  👤 Jung ─── 🧠 Shadow ─── 🧠 Anima         │   │
│  │          /          \                        │   │
│  │      📖 Symbols   💡 Self                    │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  [Focus: Shadow]  Depth: [1] [2] [3]                │
│  Filter: [All] [Concepts] [Thinkers] [Books]        │
│                                                     │
│  Click any node to navigate or explore               │
└─────────────────────────────────────────────────────┘
```

## Graph Navigation Features

| Feature | Description |
|---------|-------------|
| **Click to navigate** | Click any node → navigate to that Object page |
| **Hover preview** | Hover a node → show tooltip with title + type + description |
| **Depth control** | Show 1, 2, or 3 hops from the current Object |
| **Type filter** | Show only Concepts, only Thinkers, etc. |
| **Expand on click** | Click a node → show its connections without navigating |
| **Back navigation** | Breadcrumb trail of graph navigation history |
| **Search within graph** | Filter visible nodes by name |
| **Pinch/zoom** | Scroll to zoom, drag to pan |

## Implementation (No AI)

```sql
-- 1-hop traversal
SELECT source_id, source_type, target_id, target_type, relation_type
FROM relationships
WHERE source_id = :current_id
   OR target_id = :current_id;

-- 2-hop traversal
WITH one_hop AS (
  SELECT source_id, target_id FROM relationships
  WHERE source_id = :current_id OR target_id = :current_id
)
SELECT DISTINCT r.source_id, r.target_id, r.relation_type
FROM relationships r
JOIN one_hop oh ON r.source_id = oh.target_id OR r.target_id = oh.source_id
WHERE r.source_id != :current_id AND r.target_id != :current_id;
```

## Acceptance Criteria

- [ ] Every Object page shows connected Objects
- [ ] Clicking a connection navigates to that Object
- [ ] Depth control shows more connections
- [ ] Type filter narrows visible connections
- [ ] Graph loads in < 500ms for typical Objects
- [ ] Back navigation works intuitively
