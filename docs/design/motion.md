# Motion System

Motion has one job: **Explain**. Not Impress.

## Motion Philosophy

```
Animation must help understanding
    │
    ├── Show spatial relationships (this came from that)
    ├── Show state changes (this is now different)
    ├── Show hierarchy (this contains that)
    └── Show sequence (this happens after that)

Animation must never
    │
    ├── Distract from content
    ├── Slow down reading
    ├── Compete for attention
    └── Exist purely for decoration
```

## Motion Rules

### Duration

| Context | Duration | Easing |
|---------|----------|--------|
| Micro-interaction (hover, focus) | 150ms | ease-out |
| Component transition (expand, fade) | 200ms | ease-out |
| Page transition | 300ms | ease-in-out |
| Overlay / Modal | 300ms | ease-out |
| Knowledge Graph | 500ms | ease-out |

### Easing

- Default: `cubic-bezier(0.4, 0, 0.2, 1)` — natural, not mechanical
- Enter: `cubic-bezier(0, 0, 0.2, 1)` — fast start, slow end
- Exit: `cubic-bezier(0.4, 0, 1, 1)` — slow start, fast end

### What Animates

| Element | Animation | Reason |
|---------|-----------|--------|
| Links on hover | Underline slide-in | Shows interaction target |
| Cards on hover | Slight lift (translateY -2px) | Shows selectability |
| Sidebar panel | Slide from right | Shows spatial origin |
| Overlay | Fade in | Shows layer change |
| TOC highlight | Smooth scroll | Shows position |
| Knowledge Graph | Node spring | Shows connectivity |
| Loading skeleton | Gentle pulse | Shows activity without urgency |
| Notifications | Slide down | Shows temporal arrival |
| Page content | Fade in (not slide) | Gentle, no motion sickness |

### What Never Animates

- Body text
- Headings
- Navigation text
- Meta information (dates, reading time)
- Search results (appear instantly or skeleton)
- Critical information that user needs to read immediately

### Reduced Motion

- Respect `prefers-reduced-motion`
- When enabled: no transitions, no parallax, no floating elements
- Page loading uses opacity only (no translate)
- Hover states use color change instead of lift
- Knowledge Graph renders static instead of animated
