# Spacing

A consistent spacing scale applied across the entire system.

## Scale

```
 4px   (0.25rem)  — Micro spacing (icon padding)
 8px   (0.5rem)   — Tight spacing (label gaps)
12px   (0.75rem)  — Component padding (small)
16px   (1rem)     — Base unit (most padding, gaps)
24px   (1.5rem)   — Section padding (card padding)
32px   (2rem)     — Component group spacing
48px   (3rem)     — Section spacing
64px   (4rem)     — Large section spacing
96px   (6rem)     — Page section spacing
```

## Usage Rules

| Context | Spacing | Example |
|---------|---------|---------|
| Between icons in a row | 4px | Icon set |
| Between label and value | 8px | Metadata |
| Card inner padding | 16px | Card content |
| Between card elements | 12px | Title to description |
| Between cards in a grid | 24px | Card grid gap |
| Between sections on page | 48px | Hero to first section |
| Between major page blocks | 64px | Content to footer |
| Page outer padding | 24px (mobile) → 48px (desktop) | Edge margins |

## Spacing Principles

- Never use arbitrary spacing values — always use the scale
- Component gaps are defined in the component, not by parent
- Responsive spacing scales down on mobile (multiply by 0.75)
- Vertical rhythm: all block-level elements follow the spacing scale
- No margin collapsing issues — use gap-based layouts (flex gap, grid gap)
