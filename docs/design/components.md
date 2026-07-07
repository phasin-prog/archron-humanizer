# Components

## Primitive Components

| Component | Description | States |
|-----------|-------------|--------|
| Button | Action trigger | default, hover, active, disabled, loading |
| Card | Content container | default, hover, selected |
| Badge | Status or count indicator | neutral, success, warning, error, info |
| Chip | Filter or tag pill | default, active, removable |
| Avatar | User image placeholder | with-image, initials, anonymous |
| Tag | Object type label | per Object type, colored |
| Input | Text entry field | default, focus, error, disabled |
| Panel | Sidebar content container | collapsed, expanded |
| Divider | Visual separation | horizontal, vertical |
| Tooltip | Contextual information | show, hide |
| Skeleton | Loading placeholder | per component shape |

## Composite Components

| Component | Description | Content |
|-----------|-------------|---------|
| Concept Card | Preview of a Concept | Title, definition, related count, domain badge |
| Thinker Card | Preview of a Thinker | Portrait, name, nationality, key ideas count |
| Book Card | Preview of a Book | Cover, title, author, year, theme tags |
| Article Card | Preview of an Article | Title, excerpt, reading time, author, date |
| Symbol Card | Preview of a Symbol | Symbol image, name, meaning, cultural context |
| Theory Card | Preview of a Theory | Title, definition, school badge, concept count |
| School Card | Preview of a School | Title, historical period, thinker count, theory count |
| Timeline Entry | A date + event | Date, title, description, related thinkers |
| Quote Block | Styled quote presentation | Quote text, attribution, source, context |
| Reference | Citation display | Author, title, year, formatted citation |
| Concept Link | Inline concept with tooltip | Concept name + hover tooltip with definition |
| Thinker Link | Inline thinker with tooltip | Thinker name + hover tooltip with bio |
| Knowledge Card | Generic object preview | Type icon, title, description, metadata |
| Compare View | Side-by-side comparison | Two objects compared across selected dimensions |
| Related Section | Auto-generated related content | Grid of related Object cards |
| Breadcrumbs | Taxonomic path | Discipline → School → Theory (linked) |
| Table of Contents | Page navigation | Heading links with active indicator |

## Component Rules

- Every component is typed with TypeScript interfaces
- Every component has a loading state (skeleton)
- Every component has an error state (fallback display)
- Every component is responsive (tested at 3 breakpoints)
- Every component supports dark mode
- No component depends on any other component's internal state
- Components are pure — same props always produce same output
- Component props are explicitly defined — no spreading unknown props
