# Constellation

The signature feature of ARCHRON. Not a graph for show — a graph for **understanding**.

## Concept

Constellation is a radial knowledge graph centered on any Object. It shows how that Object connects to the rest of the knowledge ecosystem.

## Layout

```
                 Thinker
                    │
        Concept ─── Object ─── Concept
                    │
                Book ─── Concept
                           │
                       Symbol
```

## Interactive Behavior

### Default State
- Center: current Object (large, labeled)
- First ring: directly related Objects (medium, labeled)
- Second ring: indirectly related (small, dimmed)
- Edges: curved lines, labeled with relation type on hover
- Opacity: center 100%, ring 1: 80%, ring 2: 40%

### Interactions

| Action | Result |
|--------|--------|
| Hover node | Highlight node + connected edges, dim others |
| Click node | Show info card (title + description + type) |
| Double-click node | Navigate to Object page |
| Drag node | Reposition (temporary) |
| Scroll | Zoom in/out |
| Drag background | Pan |
| Click edge | Show relation type label |
| Search within graph | Filter visible nodes |

### Info Card (on click)

```
┌────────────────────────────────┐
│  🧠 Shadow                     │
│  Archetype in Analytical       │
│  Psychology                    │
│                                │
│  Connected to: 12 objects      │
│                                │
│  [View Page]  [Explore Here]   │
└────────────────────────────────┘
```

## Filters

The Constellation supports filtering:

```
[All] [Concepts Only] [Thinkers Only] [Books Only]
```

When filtered, only connections of the selected type are shown.

## Constellation Page

```
┌─────────────────────────────────────────────────────┐
│  Constellation                                       │
│                                                     │
│  Current: Shadow (Concept)  [Change]                │
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
│  Filters: [All] [Concepts] [Thinkers] [Books]       │
│  Depth: [1] [2] [3]                                 │
│                                                     │
│  Connected Objects: 12                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Constellation Rules

- Every Object page has an "Explore Connections" button that opens the Constellation
- The Constellation is loaded on interaction — not on page load
- Max depth: 3 rings (beyond that is noise)
- Node size reflects connection count (more connections = larger)
- Each Object type has a unique color (consistent with design system)
- Touch devices: tap to select, pinch to zoom
- Keyboard: Arrow keys to navigate between nodes
- Reduced motion: static layout with opacity transitions only
- Performance: target 60fps with 200+ visible nodes
