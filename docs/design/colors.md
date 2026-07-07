# Color System

Color represents meaning, not decoration.

## Color Roles

| Role | Purpose |
|------|---------|
| Neutral | 90% of the interface. Text, backgrounds, borders. |
| Academic | Accent color. Links, active states, highlights. |
| Knowledge | Category colors for Object types and Domains. |
| Semantic | Status indicators: success, warning, error, info. |
| Interaction | Hover, focus, pressed states. |

## Palette

### Neutral (Base)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | #FAF8F5 | #1A1A1A | Page background |
| `--bg-card` | #FFFFFF | #242424 | Card surface |
| `--bg-elevated` | #F5F3F0 | #2A2A2A | Hover states |
| `--border` | #E5E2DC | #333333 | Borders, dividers |
| `--text-secondary` | #8A8780 | #888888 | Meta, captions |
| `--text-body` | #3A3835 | #CCCCCC | Body text |
| `--text-heading` | #1A1815 | #EEEEEE | Headings |
| `--text-inverse` | #FFFFFF | #1A1A1A | Text on dark backgrounds |

### Academic (Accent)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--accent` | #8B5E3C | #C4A882 | Links, active elements |
| `--accent-hover` | #7A4E2E | #B89970 | Hover state |
| `--accent-subtle` | #F5EDE5 | #2A221A | Subtle background |

A warm brown — not blue (too corporate), not green (too natural), not red (too urgent). Academic, warm, timeless.

### Knowledge Categories

| Object Type | Color | Token |
|-------------|-------|-------|
| Concept | Warm Blue | `#5B7FAB` |
| Thinker | Deep Green | `#5A8A6A` |
| Theory | Purple | `#8A7AB5` |
| School | Teal | `#5A8A8A` |
| Book | Amber | `#B58A5A` |
| Article | Rose | `#AB6B7A` |
| Symbol | Gold | `#C4A040` |
| Timeline | Slate | `#6A7A8A` |
| Quote | Sage | `#7A9A7A` |
| Guide | Indigo | `#6A7AB5` |

### Semantic

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--success` | #4A8A5A | #5AAA6A | Published, approved |
| `--warning` | #C48A30 | #D4A040 | Needs review, warning |
| `--error` | #B55A5A | #D46A6A | Error, critical |
| `--info` | #5A7AAA | #6A8ABA | Information |

## Color Rules

- Neutral colors cover 90%+ of the interface
- Academic accent is used sparingly — links and key actions only
- Knowledge category colors are used for badges, icons, and graph nodes only — never for text or backgrounds
- Semantic colors for status indicators only — never for decoration
- All color pairs meet WCAG AA contrast ratio (4.5:1 text, 3:1 large text)
- Dark mode uses the same hue, different luminance — no inverted colors
