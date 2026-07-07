# Responsive Design

Not "shrink desktop." **Render differently.**

## Breakpoints

| Name | Width | Device |
|------|-------|--------|
| Mobile | < 640px | Phone |
| Tablet | 640px - 1024px | Tablet, small laptop |
| Desktop | > 1024px | Laptop, desktop |

## Per-Device Priorities

### Desktop
```
Priority 1: Deep reading (sidebars, related content visible)
Priority 2: Knowledge Graph (interactive, full-screen capable)
Priority 3: Multiple navigation modes (browse, search, timeline)
```

### Tablet
```
Priority 1: Reading (content column full width)
Priority 2: Navigation (hamburger or bottom nav)
Priority 3: Quick access to related content (expandable)
```

### Mobile
```
Priority 1: Content reading (no chrome)
Priority 2: Search (always accessible via header)
Priority 3: Essential navigation only
```

## Responsive Component Behavior

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Sidebar | Visible, 320px | Hidden, drawer toggle | Hidden, drawer toggle |
| Related Content | Right sidebar | Below content | Below content (2 items) |
| Table of Contents | Sticky sidebar | Collapsible | Hidden (scroll to sections) |
| Breadcrumbs | Full path | Last 2 items | Last item only |
| Knowledge Graph | Full interactive | Simplified view | Static preview + link |
| Timeline | Horizontal, scroll | Horizontal, scroll | Vertical list |
| Card Grid | 3 columns | 2 columns | 1 column |
| Header | Full nav + search | Condensed nav + search | Logo + search icon + menu |
| Footer | Full 4-column | 2-column | Stacked |
| Hero | Full width, large text | Full width, medium text | Compact, small text |

## Responsive Spacing

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Page padding | 48px | 32px | 16px |
| Section gap | 64px | 48px | 32px |
| Card grid gap | 24px | 16px | 12px |
| Content max-width | 720px | 100% | 100% |

## Responsive Rules

- All layouts are mobile-first — base styles are mobile, media queries add complexity
- No horizontal scrolling at any breakpoint
- No hiding critical information on mobile
- Touch targets are minimum 44x44px on mobile/tablet
- Images are fluid — max-width 100%
- Tables on mobile: convert to card list layout
- Navigation: bottom tab bar on mobile, top bar on desktop
- Sidebar content is never hidden from screen readers
