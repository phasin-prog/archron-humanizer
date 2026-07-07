# ARCHRON Homepage Rule

Version: 1.0
Type: Immutable Rule
Enforcement: ABSOLUTE

## Structure (Must Follow This Order)

```
1. HERO
2. SEARCH BAR
3. CONTINUE READING (conditional — authenticated users only)
4. FEATURED GUIDE
5. LATEST KNOWLEDGE
6. FOOTER
```

## Section Rules

### 1. Hero
- Title: "ARCHRON" in font-display (Playfair Display, serif)
- Subtitle: "Understanding Humanity" / "Through Knowledge" in font-serif, text-muted
- Background: radial gradient from primary/0.06 at 40% height, transparent at edges
- Constellation: subtle diagonal lines in `opacity-[0.04]` using primary color
- No image, no illustration, no animation competing with text
- Text pāk center
- Z-index: text above gradient

### 2. Search Bar
- Position: below hero, overlapping slightly (-mt-8)
- Width: max-w-reading (720px)
- Placeholder: "Search Everything..."
- Style: rounded-xl, border-border, bg-card, centered text, font-serif
- Focus state: border-primary/40, ring-1, ring-primary/20
- Center-aligned

### 3. Continue Reading
- Visible only when user is authenticated AND has reading history
- Title: "Continue Reading"
- Layout: 3-column grid
- Each card: concept badge, progress percentage, title, description
- Badge color: domain color
- Progress: text-disabled, size text-caption

### 4. Featured Guide
- Title: "Featured Guide"
- Layout: 2-column grid
- Each card: Guide badge (primary color), lesson count, title, description
- Badge: rounded-full, bg-primary/15, text-primary

### 5. Latest Knowledge
- Title: "Latest Knowledge"
- Layout: 4-column grid on desktop, 2 on tablet, 1 on mobile
- Each card: object type badge (object color), title, domain label
- Badge: colored background at 15% opacity, colored text

### 6. Footer
- Links: Support ☕, About, Privacy, Terms
- Layout: flex row, centered, gap-6
- Style: text-caption, text-text-muted, hover:text-primary
- Above footer: border-t border-border at mt-24
- No logo, no tagline in footer

## Card Rules

Every card:
- bg-card background, border-border border, rounded-xl
- Hover: bg-elevated, border-primary/30
- Transition: duration-[var(--motion-normal)]
- Title: font-serif, text-card-title, font-semibold
- Description: font-sans, text-caption, text-text-muted, line-clamp-2

## Color Rules

- Neutral: 85% — background, card, border, text
- Typography: 10% — headings, body
- Semantic: 4% — badges (domain and object type colors)
- Gold accent: 1% — primary (#C49B55) on hover states, guide badges

## Spacing Rules

- Sections: mt-20 from previous
- Container: max-w-container-page (1280px)
- Section padding: px-6
- Hero padding: pb-24 pt-32
- Card padding: p-4 or p-5 or p-6 depending on content density
- Card gap: gap-4

## Typography Rules

- Hero title: font-display, text-display, font-bold, tracking-tight
- Hero subtitle: font-serif, text-page-title, font-light
- Section titles: font-serif, text-section, font-semibold
- Card titles: font-serif, text-card-title, font-semibold
- Card text: font-sans, text-caption
- Search placeholder: font-serif, text-body

## Anti-Patterns (NEVER)

- Never add images or illustrations to hero
- Never add animations that compete with text
- Never use colors outside the 85/10/4/1 hierarchy
- Never add "hero buttons" (CTA) — the search bar IS the CTA
- Never use gradients for decoration
- Never add a logo — the word "ARCHRON" is the logo
- Never add sub-navigation in the homepage
- Never change the section order

## Implementation

- File: `apps/web/src/app/page.tsx`
- Must import design tokens from `@archron/shared` when using color values programmatically
- Must use CSS custom properties (var(--color-*)) for all colors
- Must use motion tokens (var(--motion-*)) for all transitions
