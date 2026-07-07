# Search

Search is the **entry point** — not a feature. Always accessible, always fast.

## Search Bar

```
┌──────────────────────────────────────────────────────────┐
│  🔍  Search concepts, thinkers, books, articles...      │
└──────────────────────────────────────────────────────────┘
```

- Always visible in the header
- Placeholder text hints at what's searchable
- Autocomplete opens after 2 characters
- Search is keyboard-focusable via `/` shortcut

## Autocomplete

```
┌──────────────────────────────────────────────────────────┐
│  shadow                                                  │
│                                                          │
│  Concepts                                                │
│  ├── 🧠 Shadow (archetype)                              │
│  │   "The shadow is an unconscious aspect..."            │
│  ├── 🧠 Shadow Work                                     │
│  │   "The process of integrating the shadow..."          │
│                                                          │
│  Thinkers                                                │
│  ├── 👤 Carl Jung (1875-1961)                           │
│                                                          │
│  Books                                                   │
│  ├── 📖 The Shadow: A Personal History                   │
│  │   by Carl Jung — 1964                                │
│                                                          │
│  Articles                                                │
│  ├── 📄 Understanding the Shadow                         │
│                                                          │
│  Press Enter to see all results →                        │
└──────────────────────────────────────────────────────────┘
```

- Results grouped by Object type with icons
- Max 8 suggestions (2 per type)
- Tab/Arrow keys navigate suggestions
- Enter navigates to highlighted result
- "See all results" at the bottom

## Search Results Page

```
┌──────────────────────────────────────────────────────────┐
│  Results for "shadow"  (24 results)                     │
│                                                          │
│  Filters  │  [All]  [Concepts]  [Thinkers]  [Books] ... │
│                                                          │
│  Concepts (8)                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Shadow — Archetype in Analytical Psychology       │   │
│  │ "The shadow is the unconscious aspect..."         │   │
│  │ 🏷️ Concept · Intermediate · 15 min read           │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Shadow Work — Process of integration             │   │
│  │ "The process of making the unconscious..."       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Thinkers (2)                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Carl Jung — Swiss psychiatrist (1875-1961)       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Books (4)                                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Man and His Symbols — Carl Jung, 1964            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Articles (6)                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Understanding the Shadow — by Maria K.           │   │
│  │ Published Jun 2024 · 8 min read                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Load More]                                             │
└──────────────────────────────────────────────────────────┘
```

## Search Rules

- **Empty query** shows recent or trending content (logged-in: recent searches)
- **Type filter** is persistent — user can narrow to one Object type
- **Pagination** via "Load More" button (no page numbers)
- **Results per page**: 20
- **Ranking**: exact title > alias > title substring > description > content
- **Archived** objects excluded from results
- **Drafts** excluded from results
- **No results**: show related disciplines + "Try searching for..."
- Short queries (< 3 chars) use prefix matching
- Thai: edge-gram tokenization for subword matching
