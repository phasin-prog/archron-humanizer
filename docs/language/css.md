# CSS & Styling

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Tailwind CSS v4 (CSS-first) |
| Component Library | shadcn/ui (built on Radix UI) |
| Custom CSS | Tailwind `@import` + CSS layers |
| Animation | Tailwind `animate-*` + CSS transitions |
| 3D / Graph | Three.js (CSS isolated) |

## CSS-First Configuration (Tailwind v4)

No `tailwind.config.js` — all theme tokens are defined in CSS via `@theme`:

```css
/* styles/globals.css */
@import "tailwindcss";
@import "./typography.css" layer(components);
@import "./components.css" layer(components);

@theme {
  /* Neutral palette */
  --color-bg: #FAF8F5;
  --color-bg-card: #FFFFFF;
  --color-bg-elevated: #F5F3F0;
  --color-border: #E5E2DC;
  --color-text-secondary: #8A8780;
  --color-text-body: #3A3835;
  --color-text-heading: #1A1815;

  /* Academic accent */
  --color-accent: #8B5E3C;
  --color-accent-hover: #7A4E2E;
  --color-accent-subtle: #F5EDE5;

  /* Knowledge categories */
  --color-concept: #5B7FAB;
  --color-thinker: #5A8A6A;
  --color-theory: #8A7AB5;
  --color-school: #5A8A8A;
  --color-book: #B58A5A;
  --color-article: #AB6B7A;
  --color-symbol: #C4A040;
  --color-timeline: #6A7A8A;
  --color-quote: #7A9A7A;
  --color-guide: #6A7AB5;

  /* Semantic */
  --color-success: #4A8A5A;
  --color-warning: #C48A30;
  --color-error: #B55A5A;
  --color-info: #5A7AAA;

  /* Typography */
  --font-display: "Playfair Display", "Lora", "Georgia", serif;
  --font-heading: "Inter", "system-ui", sans-serif;
  --font-body: "Lora", "Source Serif 4", "Georgia", serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  /* Type scale */
  --text-display: 48px;
  --text-display--line-height: 56px;
  --text-display--font-weight: 800;
  --text-page-title: 32px;
  --text-page-title--line-height: 40px;
  --text-page-title--font-weight: 700;
  --text-section: 24px;
  --text-section--line-height: 32px;
  --text-section--font-weight: 600;
  --text-card-title: 18px;
  --text-card-title--line-height: 24px;
  --text-card-title--font-weight: 600;
  --text-body: 16px;
  --text-body--line-height: 28px;
  --text-caption: 14px;
  --text-caption--line-height: 20px;
  --text-meta: 12px;
  --text-meta--line-height: 16px;

  /* Spacing (4px grid) */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Max width */
  --container-reading: 720px;
  --container-page: 1280px;
}

/* Dark mode */
@variant dark {
  --color-bg: #1A1A1A;
  --color-bg-card: #242424;
  --color-bg-elevated: #2A2A2A;
  --color-border: #3A3A3A;
  --color-text-secondary: #8A8A8A;
  --color-text-body: #C8C8C8;
  --color-text-heading: #E8E8E8;
  --color-accent: #C4A882;
  --color-accent-subtle: #2A221A;
}
```

## CSS Architecture

```
styles/
├── globals.css          — @import "tailwindcss" + @theme tokens
├── typography.css       — Prose styles (@layer components)
├── components.css       — Component-level overrides (rare)
└── utilities.css        — Custom utility classes (rare)
```

### Base Layer

```css
@import "tailwindcss";

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text-body);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

## Class Naming Convention

| Context | Pattern | Example |
|---------|---------|---------|
| Tailwind utility | Inline classes | `flex items-center gap-4` |
| Component variant | `data-*` attributes | `data-[state=active]` (Radix) |
| Animation trigger | CSS | `@keyframes` + Tailwind `transition-*` |
| Dark mode | `dark:` prefix | `dark:bg-neutral-900` |
| Responsive | Breakpoint prefix | `md:grid-cols-2 lg:grid-cols-3` |
| State | Tailwind state variants | `hover:`, `focus-visible:`, `disabled:` |

## Rules

- Tailwind utility classes for 95% of styling
- Custom CSS only for: complex animations, print styles, third-party overrides
- No CSS-in-JS (styled-components, emotion, CSS modules)
- No inline `<style>` tags
- Theme tokens in `@theme` block only (no `tailwind.config.js`)
- shadcn components are customized via `@theme` tokens — never edit the component source
- Dark mode via `class` strategy (toggle with JS)
- Reduced motion via Tailwind's `motion-safe:` / `motion-reduce:` prefixes
