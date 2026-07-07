# ARCHRON Icon System Rule

Version: 1.0
Type: Immutable Rule
Enforcement: ABSOLUTE

## Core Principle

Icons are not decorative assets. Icons are navigational tools. Recognition > Beauty. Consistency > Creativity. Knowledge > Icons.

## Spec

| Property | Value |
|----------|-------|
| Grid | 24 × 24 |
| Stroke | 1.75px |
| Style | Outline only |
| Corners | Slightly rounded (strokeLinecap="round", strokeLinejoin="round") |
| Perspective | Flat |
| Fill | None |
| Shadow | None |
| Gradient | None |

## Color Rules

Icons use neutral colors only. Semantic meaning expressed through container, not icon.

| State | Color Token |
|-------|-------------|
| Default | `text-text-muted` |
| Hover | `text-primary` |
| Active | `text-primary` |
| Disabled | `text-text-disabled` |
| Semantic (container) | `bg-*` + `text-*` |

## Component Architecture

```
packages/ui/src/  components/icons/
  icon.tsx                 Base Icon component with CVA (size + color variants)
  system/                  Navigation + UI icons (wrapped lucide-react)
  knowledge/               Object type icons (custom SVG)
  domains/                 Domain glyphs (custom SVG — ARCHRON unique)
```

## Usage

```tsx
import { SearchIcon, ConceptIcon, PsychologyGlyph } from "@archron/ui"

<SearchIcon size="lg" color="primary" />
<ConceptIcon size="md" />
<PsychologyGlyph size="sm" color="default" />
```

## Visual Priority

Content → Typography → Spacing → Cards → Icons → Decoration

## Forbidden

- Mixing outline and filled styles
- Coloring icons by discipline directly
- Gradients, shadows, 3D effects
- Continuous animation
- Icon fonts (SVG only)
- PNG/JPG icons
- Icons as decoration without purpose
- Rotating icons
- Icons without accessible labels (aria-label)
