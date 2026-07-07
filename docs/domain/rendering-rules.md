# Rendering Rules

## 2.7 Rendering Pipeline

```
Source (Markdown)
    │
    ▼
Parser
    │
    ├── Heading
    ├── Paragraph
    ├── Wikilink [[concept:shadow]]
    ├── Image ![[image:mandala]]
    ├── Quote > 
    ├── List
    ├── Code block
    └── Table
    │
    ▼
AST (Abstract Syntax Tree)
    │
    ▼
Knowledge Engine
    │
    ├── Resolve [[concept:shadow]] → Concept Object
    ├── Resolve [[thinker:carl-jung]] → Thinker Object
    ├── Resolve [[book:psychological-types]] → Book Object
    └── Resolve [[symbol:mandala]] → Symbol Object
    │
    ▼
Renderer
    │
    ├── Map AST node → React Component
    ├── Inject resolved Object data
    └── Compose page layout
    │
    ▼
HTML (Server-rendered or Static)
```

## Wikilink Resolution

| Pattern | Resolves To | Rendered As |
|---------|-------------|-------------|
| `[[concept:shadow]]` | Concept Object | Concept Card (inline or block) |
| `[[thinker:carl-jung]]` | Thinker Object | Thinker Tooltip + Link |
| `[[book:psychological-types]]` | Book Object | Book Reference Card |
| `[[symbol:mandala]]` | Symbol Object | Symbol Display + Link |
| `[[article:introversion]]` | Article Object | Article Link |
| `[[timeline:event-slug]]` | Timeline Event | Timeline Entry |
| `[[quote:slug]]` | Quote Object | Styled Quote Block |
| `[[reference:slug]]` | Reference | Citation Badge |

## Rendering Rules

- Every Object type has a registered React Component
- Unknown wikilinks are rendered as unresolved placeholders (visible to Editors only)
- Wikilinks are resolved at render time, not at write time
- The Knowledge Engine provides the resolved data; the Renderer never queries the database directly
- HTML output is deterministic — same Markdown + same Objects = same HTML
