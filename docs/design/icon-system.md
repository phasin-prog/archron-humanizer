# ARCHRON Icon System

Version: 1.0
Status: Active
Purpose: Icon design system for ARCHRON academic platform

---

## Core Principles

**Precision Over Decoration**

- Clean geometric shapes
- Sharp, exact lines
- No glassmorphism, no claymorphic
- No decorative effects

**Consistent Line Weight**

- Outlined style: `2px` stroke width
- Uniform across entire system
- Monochrome only

**Functional Animation**

- No constant rotation or movement
- Micro-interactions on hover/active only
- Calm, atmospheric

---

## ARCHRON Color Tokens for Icons

| Token Name | CSS Variable | Hex | Usage |
|------------|--------------|-----|-------|
| **Primary Blue** | `--color-primary` | `#5F8DCE` | Active state, primary icons |
| **Secondary Blue-Green** | `--color-secondary` | `#4F9E9A` | Secondary icons, knowledge navigation |
| **Text Primary** | `--color-text` | `#EDF2F7` | Default icon color on dark background |
| **Text Muted** | `--color-text-muted` | `#94A3B8` | Inactive icons |
| **Border** | `--color-border` | `#364152` | Icon container borders |
| **Card Background** | `--color-card` | `#293241` | Icon container background |

---

## Base Container System

```css
/* ============================================
   ICON CONTAINER — 64×64px Base
   ============================================ */

.archron-icon-box {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-md);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-sizing: border-box;
  transition: all var(--motion-normal) var(--ease-out);
  cursor: pointer;
}

/* Hover State */
.archron-icon-box:hover {
  border-color: var(--color-primary);
  background-color: var(--color-elevated);
  box-shadow: 0 4px 12px rgba(95, 141, 206, 0.08);
}

/* Active State */
.archron-icon-box:active {
  transform: scale(0.98);
}

/* Icon Graphic */
.archron-icon-box svg,
.archron-icon-box div {
  color: var(--color-text);
  transition: color var(--motion-fast) var(--ease-out);
}

.archron-icon-box:hover svg,
.archron-icon-box:hover div {
  color: var(--color-primary);
}

/* ============================================
   SIZE VARIANTS
   ============================================ */

.archron-icon-box--sm {
  width: 48px;
  height: 48px;
}

.archron-icon-box--md {
  width: 64px;
  height: 64px;
}

.archron-icon-box--lg {
  width: 80px;
  height: 80px;
}

/* ============================================
   SEMANTIC VARIANTS
   ============================================ */

/* Knowledge Navigation Icons */
.archron-icon-box--knowledge {
  border-color: var(--color-secondary);
}

.archron-icon-box--knowledge:hover {
  border-color: var(--color-secondary-hover);
  background-color: var(--color-secondary-soft);
}

/* Premium / Featured Icons */
.archron-icon-box--featured {
  border-color: var(--color-accent);
}

.archron-icon-box--featured:hover {
  border-color: var(--color-accent-hover);
  background-color: var(--color-accent-soft);
}

/* Success / Completed Icons */
.archron-icon-box--success {
  border-color: var(--color-knowledge);
}

.archron-icon-box--success:hover {
  border-color: var(--color-knowledge);
  background-color: var(--color-knowledge-soft);
}
```

---

## Icon Coverage

Icons must cover all ARCHRON content types:

### Knowledge Objects (9 types)

- Concept
- Thinker
- Article
- Book
- Quote
- Timeline
- Guide
- Symbol
- Collection

### Domains (12 types)

- Psychology
- Philosophy
- Anthropology
- History
- Language
- Mythology
- Religion
- Science
- Symbolism
- Art
- AI
- Civilization

### Actions

- Search
- Explore
- Timeline
- Constellation
- Read
- Bookmark
- Share
- Edit
- Delete
- Settings

### Status

- Progress
- Complete
- Draft
- Published
- Featured
- Archived

---

## Design Rules

**Stroke Width**

- Outlined icons: `2px` uniform
- Never mix stroke widths

**Grid System**

- 24×24px viewBox for SVG
- 2px padding inside viewBox
- Icon elements: 20×20px active area

**Geometric Precision**

- Use exact circles, squares, triangles
- Align to pixel grid
- No hand-drawn styles

**Monochrome**

- Icons use single color
- Semantic color comes from container background
- Never color the icon itself (violates constitution)

---

## Example: Book Icon

```html
<div class="archron-icon-box">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</div>
```

---

## Integration with Design Constitution

| Constitution Rule | Icon System Implementation |
|-------------------|---------------------------|
| Typography > Colors | Icons monochrome, semantic color from container |
| No high saturation | No colored icons, use muted border colors |
| 85% neutral | Most icons use default text color |
| Interface invisible | Outline style, no decorative fills |
| Calm motion | Subtle hover only, no constant animation |
| Academic feeling | Geometric precision, no playful styles |

---

## React Component Template

```tsx
interface IconBoxProps {
  icon: React.ReactNode
  size?: "sm" | "md" | "lg"
  variant?: "default" | "knowledge" | "featured" | "success"
  onClick?: () => void
}

export function IconBox({ 
  icon, 
  size = "md", 
  variant = "default",
  onClick 
}: IconBoxProps) {
  return (
    <div 
      className={cn(
        "archron-icon-box",
        `archron-icon-box--${size}`,
        variant !== "default" && `archron-icon-box--${variant}`
      )}
      onClick={onClick}
    >
      {icon}
    </div>
  )
}
```

---

## Next Steps

- [ ] Design 9 knowledge object icons
- [ ] Design 12 domain icons
- [ ] Design 20 action icons
- [ ] Design 6 status icons
- [ ] Create icon component library in `@archron/ui`
- [ ] Add icon stories in Storybook

---

End of Icon System
