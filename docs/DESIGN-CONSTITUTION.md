# ARCHRON Color & Visual Design Constitution

Version: 1.0
Status: Active
Purpose: Single source of truth for all visual design decisions across all ARCHRON products

---

# Core Design Philosophy

The interface exists to reveal knowledge, not compete with it.

The user should remember the ideas.

Never the interface.

Knowledge is the primary visual element.

The UI should disappear behind the content.

This interface should feel invisible after five minutes of use.

Users should stop noticing the design and start noticing the knowledge.

---

# What ARCHRON Is

ARCHRON is a premium academic knowledge platform dedicated to understanding humanity through psychology, philosophy, anthropology, language, religion, mythology, symbolism, civilization, AI, and related disciplines.

Think of ARCHRON as a modern digital library and scholarly reading instrument.

---

# What ARCHRON Is NOT

This is NOT a SaaS dashboard.

This is NOT a startup landing page.

This is NOT a marketing website.

This is NOT a portfolio.

---

# Color Psychology

Do NOT use stereotypical internet color psychology.

Instead, design colors as psychological spaces.

Colors should create:
- Calmness
- Clarity
- Orientation
- Contemplation

The interface should feel mentally quiet.

The content should feel mentally active.

---

# Overall Feeling

- Minimal
- Timeless
- Academic
- Premium
- Quiet
- Elegant
- Readable
- Calm
- Modern
- Human-centered
- Research-oriented

Never flashy.

Never trendy.

Never over-designed.

---

# Palette Philosophy

Use muted and desaturated colors.

Avoid high saturation.

Avoid extremely dark backgrounds.

Avoid pure black.

Avoid neon colors.

Avoid high contrast accents.

Colors should naturally transition between blue, blue-green, slate, and soft green.

The palette should feel like one continuous family.

---

# Color Distribution

| Percentage | Category |
|------------|----------|
| 85% | Neutral Foundation |
| 13% | Interaction Colors |
| 2% | Special Highlights |

The interface should feel mostly neutral.

Accent colors should be rare.

---

# Foundation Colors — 85%

```css
Background   #171C24
Surface      #202733
Card         #293241
Border       #364152
Divider      #465264
```

These colors should occupy most of the interface.

---

# Typography Colors

```css
Primary      #EDF2F7
Secondary    #CBD5E1
Muted        #94A3B8
```

Typography should remain more visually important than colors.

---

# Primary Interaction Colors — 13%

```css
Primary Blue     #5F8DCE
Hover Blue       #78A6E3
Active Blue      #4B79B8
```

These colors indicate interaction only.

Never decoration.

---

# Secondary Interaction

```css
Soft Blue-Green  #4F9E9A
Hover            #66B6B1
```

Used for:
- Search
- Knowledge Graph
- Selected Items
- Related Concepts
- Knowledge Navigation

---

# Knowledge Accent

```css
Soft Green       #7BAF7A
```

Used only for:
- Reading Progress
- Completed Reading
- Learning Status
- Success

Never overused.

---

# Premium Accent — 2%

```css
Muted Gold       #B89A63
```

Used only for:
- Featured Guide
- Editor's Pick
- Curated Collection
- Support
- Achievements

Never use gold as the primary accent.

---

# Domain Colors (Muted & Desaturated)

| Domain | Color |
|--------|-------|
| Psychology | `#5A9FB5` |
| Philosophy | `#9688B8` |
| Anthropology | `#C7916A` |
| History | `#B5895F` |
| Language | `#6FA589` |
| Mythology | `#B56A6A` |
| Religion | `#8B7AA8` |
| Science | `#5A9AA8` |
| Symbolism | `#6E6BA5` |
| Art | `#B57599` |
| AI | `#7680B5` |
| Civilization | `#7A8694` |

---

# Knowledge Object Colors (Muted & Desaturated)

| Object Type | Color |
|-------------|-------|
| Concept | `#5A9FB5` |
| Thinker | `#9688B8` |
| Article | `#94A3B8` |
| Book | `#C7916A` |
| Quote | `#7A8694` |
| Timeline | `#B5A872` |
| Guide | `#6FA589` |
| Symbol | `#7680B5` |
| Collection | `#B57599` |

---

# Visual Silence

Whitespace is part of navigation.

Negative space improves understanding.

Avoid unnecessary visual density.

The interface should breathe.

---

# Motion

- Slow
- Calm
- Atmospheric

Never distracting.

Never playful.

Animations should support spatial awareness.

Not attract attention.

```css
--motion-fast: 120ms;
--motion-normal: 220ms;
--motion-slow: 420ms;
--motion-ambient: 14000ms;
```

---

# Cards

Cards are information containers.

Not decorations.

- Minimal borders
- No heavy shadows
- No glassmorphism
- No gradients
- No oversized rounded corners

---

# Icons

- Outline only
- Monochrome only
- Semantic colors belong to the background container
- Never color the icon itself

Consistency is mandatory.

---

# Typography

Typography is the main interface.

- Large hierarchy
- Comfortable reading
- Generous spacing
- Avoid visual noise

Font families:
- Display: Playfair Display
- Heading: Inter
- Body: Lora
- Mono: JetBrains Mono

---

# Hero

The Hero introduces the library.

It does not advertise.

It should explain the platform within three seconds.

- Minimal
- Calm
- Clear

---

# Avoid

Do not design like:
- Startup
- Crypto
- SaaS
- AI Landing Page
- Agency
- Portfolio
- Product Hunt
- Dribbble Showcase

Do not use:
- Glassmorphism
- Neumorphism
- Heavy gradients
- Oversized shadows
- Colorful illustrations
- Decorative animations

---

# Design Inspiration

Do NOT copy.

Instead, capture the design philosophy behind:
- Modern academic libraries
- Research platforms
- Reading-first interfaces
- Knowledge management systems
- Museum archives
- Documentation systems
- Interfaces where content is more important than UI

---

# Final Principle

Every design decision must answer one question:

**"Does this help the user understand knowledge faster?"**

If not, remove it.

---

# Implementation Reference

All design tokens are implemented in:
- `apps/web/src/styles/globals.css` (CSS variables)
- `@archron/ui` (React components)

Any visual change MUST be validated against this constitution first.

---

End of Design Constitution
