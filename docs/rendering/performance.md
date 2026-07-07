# Performance

The Renderer must be lazy by default. No component loads unless it is needed.

## Lazy Loading Rules

| Component | Load Strategy | Trigger |
|-----------|---------------|---------|
| Knowledge Graph | Dynamic import | User clicks "Show graph" or scrolls to it |
| Timeline | Dynamic import | Timeline enters viewport (Intersection Observer) |
| Gallery (lightbox) | Dynamic import | User clicks an image |
| Three.js visualization | Dynamic import | Component is in viewport |
| Compare View | Dynamic import | Component is in viewport |
| Mermaid diagram | Dynamic import | Diagram enters viewport |
| Quiz | Dynamic import | User clicks "Start quiz" |
| Footnotes | Static render | On page load (lightweight) |
| Table of Contents | Static render | On page load |
| Concept Card | Static render | On page load |
| Thinker Card | Static render | On page load |

## Caching Strategy

### Render Cache

```
Request
    │
    ▼
Cache Check
    │
    ├── HIT  → Return cached HTML (Fast)
    └── MISS → Full render → Cache result
```

| Cache Level | Duration | Invalidation |
|-------------|----------|--------------|
| Full page (ISR) | On-demand | `revalidatePath` on publish |
| Component output | Request-scoped | End of request |
| Knowledge Engine query | Request-scoped | End of request |
| AST output | Request-scoped | End of request |

### Bundle Size

- Markdown parser loaded on demand (only on content pages)
- Knowledge Graph bundle (~150KB) loaded only on graph interactions
- Editor bundle loaded only on `/studio` and `/editor` routes
- Renderer core bundle must be < 30KB gzipped
- All components support tree-shaking

## Rendering Performance Rules

- No synchronous database calls during render
- All Knowledge Engine queries are cached for the request lifetime
- AST processing is O(n) where n = number of AST nodes
- Component rendering follows React best practices (memo, useMemo where needed)
- Large lists are virtualized
- Images use Next.js `next/image` with lazy loading
- Font faces are subsetted — no full font files loaded
