# Responsive Rendering

Responsiveness is not just CSS. The Renderer must adapt the **component selection** and **data presentation** based on the device.

## Principle

```
Desktop
    │
    ├── Knowledge Graph → Interactive, full-screen
    ├── Timeline → Horizontal, scrolling
    └── Sidebar → Visible, persistent

Mobile
    │
    ├── Knowledge Graph → Simplified static preview + "Open full" link
    ├── Timeline → Vertical, stacked
    └── Sidebar → Collapsed, accessible via drawer
```

## Responsive Component Selection

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Concept Card | Full card with sidebar | Compact card, no sidebar |
| Thinker Card | Large portrait + bio | Small portrait + expandable bio |
| Knowledge Graph | Interactive d3/Three.js | Static SVG preview + link |
| Timeline | Horizontal interactive | Vertical list |
| Table | Full table | Card list (each row = card) |
| Compare View | Side-by-side | Stacked |
| Gallery | Grid layout | Single scroll |
| TOC | Floating sidebar | Collapsible drawer |

## Implementation

- The Component Resolver receives a `viewport` context
- Components can register different variants per breakpoint
- Breakpoints are defined in the design system, not per-component
- Heavy interactive components (Graph, Timeline) use dynamic imports + conditional rendering
- No data loading based on viewport — all data is pre-resolved, only presentation differs
