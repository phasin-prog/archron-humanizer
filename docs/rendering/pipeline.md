# Rendering Pipeline

## Full Pipeline

```
Markdown Source
    │
    ▼
1. Tokenizer
    │   └── Break Markdown into tokens (text, heading, list, wikilink, etc.)
    │
    ▼
2. AST Builder
    │   └── Build hierarchical AST from tokens
    │
    ▼
3. Knowledge Resolver
    │   └── Resolve all [[type:slug]] references via Knowledge Engine
    │   └── Inline metadata into AST nodes
    │
    ▼
4. Component Resolver
    │   └── Map each AST node type → registered React Component
    │   └── Context-aware selection (mobile vs desktop, theme)
    │
    ▼
5. Layout Resolver
    │   └── Select page layout based on Object type
    │   └── Compose sidebar, TOC, related content
    │
    ▼
6. React Render
    │   └── Render component tree to React elements
    │
    ▼
7. HTML Output
    │   └── Server-rendered HTML (SSR/SSG)
    │   └── Includes SEO metadata, JSON-LD, Open Graph
```

## Pipeline Rules

- Each stage receives the output of the previous stage only
- The Knowledge Resolver is the only stage that calls the Knowledge Engine
- The Component Resolver never queries data — it only maps AST nodes to components
- The Layout Resolver is optional — used only for full-page renders, not inline content
- If any stage fails, the pipeline returns a graceful fallback (never crashes the page)
- The pipeline is deterministic — same input always produces same output
