# Layout System

Not page-by-page design. Layout primitives that compose into pages.

## Layout Primitives

```
┌──────────────────────────────────────┐
│           Hero                       │
│   Title + Description + Action       │
├──────────────────────────────────────┤
│                                      │
│   Section                            │
│   ┌──────────────────────────────┐   │
│   │  Content                     │   │
│   │  (full width)                │   │
│   └──────────────────────────────┘   │
│                                      │
├──────────────────┬───────────────────┤
│   Content        │   Sidebar         │
│   (main)         │   (related,       │
│                  │    backlinks, etc)│
│                  │                   │
├──────────────────────────────────────┤
│           Footer                     │
│   Navigation + Meta + Links          │
└──────────────────────────────────────┘
```

## Layout Templates

| Template | Structure | Used For |
|----------|-----------|----------|
| **Hero + Content** | Hero → Section → Section | Homepage, Discipline pages |
| **Hero + Content + Sidebar** | Hero → Content+Sidebar → Section | Concept, Thinker, Theory pages |
| **Reading** | Content (centered, narrow) | Article pages |
| **Reading + Sidebar** | Content + Sidebar | Article with TOC/references |
| **Guide** | Progress bar + Content + Sidebar | Guide lessons |
| **Browse** | Filter bar + Grid of cards | Search results, Browse pages |
| **Full-width** | Hero → Full content | Symbol display, Timeline |
| **Overlay** | Panel over dimmed background | Knowledge Graph, Modal |
| **Studio** | Nav + Workspace + Inspector | Studio workspace |

## Responsive Layout Behavior

| Template | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Content + Sidebar | Side-by-side | Sidebar below | Stacked |
| Reading | Centered 720px | Full width | Full width with padding |
| Browse | Grid 3-col | Grid 2-col | List 1-col |
| Hero | Full width | Full width | Compact |
| Guide | Content + progress | Content + progress | Content only |

## Layout Rules

- Every page uses exactly one layout template
- Layouts are composable — sections within layouts are interchangeable
- Sidebar content is determined by the Object type, not the layout
- No layout is wider than 1280px max-width
- Reading content max-width: 720px (optimal line length)
- Sidebar min-width: 280px, max-width: 360px
