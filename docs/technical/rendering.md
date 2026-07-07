# Rendering Pipeline

## 3.3 Render Flow

```
Markdown
    │
    ▼
Parser (markdown-it / unified)
    │
    ▼
AST (Abstract Syntax Tree)
    │
    ▼
Knowledge Engine
    │   ├── Resolve [[concept:shadow]] → Concept Object
    │   ├── Resolve [[thinker:carl-jung]] → Thinker Object
    │   ├── Resolve [[book:psychological-types]] → Book Object
    │   └── Resolve [[symbol:mandala]] → Symbol Object
    │
    ▼
Renderer
    │   ├── Map AST node → React Component
    │   ├── Inject resolved Object data
    │   └── Compose page layout
    │
    ▼
React Components
    │   ├── HeadingRenderer
    │   ├── ParagraphRenderer
    │   ├── ConceptCard
    │   ├── ThinkerTooltip
    │   ├── BookReference
    │   ├── SymbolDisplay
    │   ├── QuoteBlock
    │   └── CitationBadge
    │
    ▼
HTML (Server-rendered or Static)
```

## Alternative Flow (Object Page)

```
Object Slug
    │
    ▼
Knowledge Engine
    │   ├── Fetch Object data
    │   ├── Resolve backlinks
    │   └── Resolve relationships
    │
    ▼
Renderer
    │   └── Compose Object page layout from registered components
    │
    ▼
Page
```

## Rendering Rules

- Every Object type registers a page layout component
- Every AST node type registers an inline/block component
- The Knowledge Engine is the only source of truth for resolved data
- The Renderer never queries the database directly
- Output is deterministic — same input always produces same output
- Rendering happens at request time (SSR) or build time (SSG) depending on Object type and update frequency
