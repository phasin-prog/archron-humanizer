# Knowledge Resolver

The heart of the Rendering Engine.

## What it does

When the Renderer encounters `[[concept:shadow]]`, it does not treat it as text. It asks the Knowledge Engine for the complete Object.

## Resolution Flow

```
Input: [[concept:shadow]]
    │
    ▼
Knowledge Engine
    │
    ├── slug: "shadow"
    ├── type: "concept"
    ├── title: "Shadow"
    ├── definition: "The shadow is an archetype..."
    ├── aliases: ["เงา", "ดวงเงา"]
    ├── related: ["Persona", "Anima", "Individuation"]
    ├── originator: { slug: "carl-jung", type: "thinker" }
    └── metadata: { difficulty: "intermediate", reading_time: 15 }
    │
    ▼
AST Node Enriched
    │
    └── Now carries all resolved data ready for the Component Resolver
```

## Resolution Strategies

| Pattern | Strategy | Fallback |
|---------|----------|----------|
| `[[concept:shadow]]` | Fetch Concept by slug | Render as unresolved link (editor only) |
| `[[thinker:carl-jung]]` | Fetch Thinker by slug | Render as plain text link |
| `[[book:psychological-types]]` | Fetch Book by slug | Render as citation text |
| `[[symbol:mandala]]` | Fetch Symbol by slug | Render as italic text |
| `[[article:introversion]]` | Fetch Article by slug | Render as link |
| `[[quote:jung-123]]` | Fetch Quote by ID | Render as blockquote |
| `[[timeline:1912]]` | Fetch events by year | Render as year link |
| `[[reference:slug]]` | Fetch Reference by slug | Render as inline citation |
| `[[related]]` | Auto-compute related objects | Render nothing |
| `[[graph]]` | Fetch full graph for current object | Render placeholder |
| `[[compare:freud,jung]]` | Fetch both Thinkers | Render comparison placeholder |

## Rules

- Resolution happens once per render — results are cached for the request lifecycle
- Unknown slugs render differently depending on user Role (Editor sees debug info, Reader sees nothing)
- The Knowledge Resolver never modifies the database — it only reads
- Circular references are detected and stopped at depth 3
