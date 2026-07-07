# Typography

Not choosing a font. Defining a hierarchy.

## Typeface

| Role | Font | Fallback |
|------|------|----------|
| Display | Serif (Playfair Display / Lora) | Georgia, serif |
| Headings | Sans-serif (Inter) | system-ui, sans-serif |
| Body | Serif (Lora / Source Serif 4) | Georgia, serif |
| UI / Labels | Sans-serif (Inter) | system-ui, sans-serif |
| Code | Mono (JetBrains Mono / Fira Code) | monospace |
| Academic | Serif (for long-form reading) | Georgia, serif |

## Hierarchy

```
Display (h1)       → 48px / 56px  (800 weight)
    │                    Used for: Page title, Hero
    ▼
Page Title (h2)    → 32px / 40px  (700 weight)
    │                    Used for: Section headings
    ▼
Section (h3)       → 24px / 32px  (600 weight)
    │                    Used for: Subsection headings
    ▼
Card Title (h4)    → 18px / 24px  (600 weight)
    │                    Used for: Card titles, Object names
    ▼
Body / Paragraph   → 16px / 28px  (400 weight)
    │                    Used for: Content reading
    ▼
Caption            → 14px / 20px  (400 weight)
    │                    Used for: Image captions, metadata
    ▼
Meta / Small       → 12px / 16px  (400 weight)
                         Used for: Badges, timestamps, labels
```

## Reading Rules

- Body line-height: 1.75 (28px at 16px font)
- Maximum line length: 720px (optimal: 60-75 characters)
- Paragraph margin-bottom: 1.5em
- No text justification — left-aligned only
- Links are underlined only within body text (not in navigation)
- Code: 14px / 20px with 1.4 line-height
- Blockquotes: italic, left border, 18px body size
- List spacing: 0.5em between items
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
