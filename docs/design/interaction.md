# Interaction

All interactions follow the same rules system-wide.

## Interaction States

Every interactive element has four states:

```
Default ──→ Hover ──→ Pressed
   │                    │
   └──── Focus ─────────┘
```

Plus contextual states:

- **Loading** — Action in progress (use skeleton or spinner)
- **Disabled** — Action not available (gray + no interaction)
- **Success** — Action completed successfully
- **Error** — Action failed

## Interaction Patterns

### Links

| State | Behavior |
|-------|----------|
| Default | Underlined (body text only), accent color |
| Hover | Color darkens, underline persists |
| Focus | Outline ring (accent color) |
| Visited | Differentiated (subtle hue shift) |
| Active | Color darkens further |

### Buttons

| State | Behavior |
|-------|----------|
| Default | Filled (primary) or outlined (secondary) |
| Hover | Background darkens slightly |
| Focus | Outline ring (accent color) |
| Pressed | Scale 0.98, background darkens |
| Loading | Spinner replaces text, no interaction |
| Disabled | 40% opacity, no hover/focus effects |

### Cards

| State | Behavior |
|-------|----------|
| Default | Flat with border |
| Hover | Slight lift (translateY -2px), border accent |
| Focus | Outline ring |
| Click | Navigate to target |
| Selected | Accent border, checkmark indicator |

### Form Elements

| State | Behavior |
|-------|----------|
| Default | Neutral border, no shadow |
| Focus | Accent border + ring |
| Hover | Slightly darker border |
| Error | Error color border + error message below |
| Disabled | 40% opacity |
| Filled | Value present, standard display |

## Interaction Rules

- All clickable elements have cursor: pointer
- All interactive elements have visible focus indicators (outline ring)
- Hover effects are subtle — never jarring
- Touch targets are minimum 44x44px (mobile)
- No interaction should ever be the only way to access information
- Right-click is preserved for browser context menu
- Never override default browser behaviors (scroll, zoom, text selection)
