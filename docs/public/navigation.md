# Navigation

No 5-level submenus.

## Navigation Structure

### Top Bar (Global)

```
[Logo]  [Explore]  [Search...]  [Timeline]  [Constellation]  [About]  [Sign In]
```

- Search is always visible — never hidden behind a menu
- Maximum 6 items in the top bar
- The top bar is the same on every page
- No dropdown menus in the top bar
- On mobile: Logo + Search icon + Hamburger

### Explore Menu

When the user clicks "Explore":

```
┌─────────────────────────────────────┐
│  Explore Knowledge                  │
│                                     │
│  Psychology                         │
│  ├── Analytical Psychology          │
│  ├── Psychoanalysis                 │
│  ├── Behaviorism                    │
│  └── All Psychology →               │
│                                     │
│  Philosophy                         │
│  ├── Existentialism                 │
│  ├── Stoicism                       │
│  ├── Idealism                       │
│  └── All Philosophy →               │
│                                     │
│  [Browse All Disciplines]           │
└─────────────────────────────────────┘
```

- One level of nesting only
- "All →" link at the bottom of each discipline
- "Browse All Disciplines" at the bottom

### Breadcrumbs (Knowledge Path)

Not navigation — a **knowledge path**.

```
Psychology  >  Analytical Psychology  >  Psychological Types  >  Shadow
```

- Every Object page has breadcrumbs
- Shows the full taxonomic path: Discipline → School → Theory → Object
- Last item is current page (not linked)
- Breadcrumbs are clickable at every level
- Truncated on mobile: show last 2 items only

### Footer

```
┌─────────────────────────────────────────────────────────────┐
│  Disciplines                          │  About              │
│  Psychology · Philosophy ·            │  Mission            │
│  Anthropology · History ·             │  Team               │
│  Language · Mythology ·               │  Contact             │
│  Religion · Science ·                 │  Privacy             │
│  Symbolism · Art ·                    │                     │
│  AI & Future · Civilization           │                     │
│                                         │                     │
│  [Logo]  © 2024 ARCHRON               │  Follow             │
└─────────────────────────────────────────────────────────────┘
```

- All 12 disciplines listed
- No social media feeds
- No newsletter signup
- No "Recent Posts"

## Navigation Rules

- No page requires more than 3 clicks from the homepage
- No mega-menus, no flyouts, no hover menus
- Mobile: bottom tab bar with 4 icons (Home, Explore, Search, Timeline)
- Breadcrumbs are not navigation — the top bar is navigation
- Every page has a visible "back to parent" path
- No sidebar navigation — sidebars contain related content, not menus
