# Explore

Replace infinite scroll with structured exploration.

## Explore Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo │ Explore │ Search │ Timeline │ About │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Explore Knowledge                                   │
│                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ 🧠         │  │ 📖         │  │ 👤         │   │
│  │ Psychology │  │ Philosophy │  │ Thinkers   │   │
│  │ 48 concepts│  │ 32 concepts│  │ 24 thinkers │   │
│  └────────────┘  └────────────┘  └────────────┘   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ 📚         │  │ ⏳         │  │ 🕊️         │   │
│  │ Books      │  │ Timeline   │  │ Symbols    │   │
│  │ 56 books   │  │ 120 events │  │ 18 symbols  │   │
│  └────────────┘  └────────────┘  └────────────┘   │
│                                                     │
│  Browse by Discipline                                │
│  ┌──────────────────────────────────────────────┐   │
│  │ Psychology        → Explore all              │   │
│  │ Philosophy        → Explore all              │   │
│  │ Anthropology      → Explore all              │   │
│  │ ...                                          │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Drill-down Flow

```
Psychology (Discipline)
    │
    ├── Analytical Psychology (School)
    │       ├── Psychological Types (Theory)
    │       │       ├── Introversion (Concept)
    │       │       ├── Extraversion (Concept)
    │       │       └── All concepts in this theory
    │       ├── Concepts (all in this school)
    │       ├── Thinkers (associated)
    │       ├── Books (associated)
    │       └── Timeline (related events)
    │
    ├── Psychoanalysis (School)
    └── All Schools in Psychology
```

## Discipline Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Psychology                                          │
│  "The scientific study of the mind and behavior."    │
│                                                     │
│  Schools (6)                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Analytical   │ │ Psychoanalysis│ │ Behaviorism ││
│  │ Psychology   │ │              │ │              ││
│  │ 12 concepts  │ │ 8 concepts   │ │ 6 concepts   ││
│  └──────────────┘ └──────────────┘ └──────────────┘│
│                                                     │
│  Featured Thinkers                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │Jung  │ │Freud │ │Pavlov│ │Skinner│              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  Timeline                                            │
│  ──●────●────●────●────●────●────●───              │
│                                                     │
│  Latest Articles                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ Article title — Author — Date                │   │
│  │ Article title — Author — Date                │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Explore Rules

- Every click takes the user deeper into knowledge — not to a search results page
- Each level shows a preview of the next level (counts, names)
- No pagination within a discipline — scroll within the page
- Breadcrumb at top: Psychology → Analytical Psychology
- A "Random" button for serendipitous discovery
- Mobile: simplified list view instead of grid
