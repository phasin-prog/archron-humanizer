# shadcn/ui

## Setup

```bash
npx shadcn@latest init
```

Components are installed into `packages/ui/src/components/`.

```json
// packages/ui/components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "../../src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@archron/ui/components",
    "utils": "@archron/ui/lib/utils",
    "hooks": "@archron/ui/hooks",
    "lib": "@archron/ui/lib",
    "ui": "@archron/ui/components/ui"
  }
}
```

## Component Installation

```bash
cd packages/ui
pnpm dlx shadcn@latest add button card dialog tooltip badge tabs accordion
```

## Customization Strategy

shadcn components are customized via `@theme` tokens in CSS — never by editing the generated source.

```css
/* Example: cards in globals.css @theme block */
@theme {
  --radius-card: 8px;
}
```

## Component Mapping

| ARCHRON Component | shadcn Base | Customizations |
|-------------------|-------------|----------------|
| Button | `button` | accent color, hover state |
| Card | `card` | border radius, shadow |
| Badge | `badge` | Knowledge category colors |
| Dialog / Modal | `dialog` | Remove overlay animation |
| Tooltip | `tooltip` | Subtle delay, accent color |
| Tabs | `tabs` | Underline style |
| Accordion | `accordion` | Minimal chevron |
| Input | `input` | Focus ring color |
| Select | `select` | Minimal style |
| Dropdown | `dropdown-menu` | Compact padding |

## Components NOT from shadcn

| Component | Source | Reason |
|-----------|--------|--------|
| Knowledge Graph | `@archron/graph` (Three.js) | Custom visualization |
| Timeline | Custom | Domain-specific interaction |
| Constellation | `@archron/graph` (Three.js) | Custom visualization |
| Post editor | `@archron/editor` (TipTap) | Rich text requirements |
| Markdown renderer | `@archron/renderer` | Custom AST → Component pipeline |
