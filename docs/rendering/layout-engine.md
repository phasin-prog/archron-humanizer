# Layout Engine

Different Objects have different structural needs. The Layout Engine selects the appropriate page layout for each Object type.

## Layout Selection

```
Object Type → Layout Engine → Layout Component
```

### Layout Types

| Layout | Used For | Structure |
|--------|----------|-----------|
| `ConceptLayout` | Concept | Left: content / Right: sidebar (related, thinkers, books) |
| `ThinkerLayout` | Thinker | Top: profile header / Middle: biography / Bottom: works + timeline |
| `TheoryLayout` | Theory | Left: content / Right: core concepts sidebar |
| `SchoolLayout` | School | Full-width intro / Grid of theories / List of thinkers |
| `ArticleLayout` | Article | Centered reading column / Floating TOC / Minimal chrome |
| `BookLayout` | Book | Left: cover + metadata / Right: summary + themes |
| `SymbolLayout` | Symbol | Center: symbol visualization / Below: meaning + context |
| `GuideLayout` | Guide | Left: lesson content / Right: progress + table of contents |
| `CollectionLayout` | Collection | Grid of items / Sort and filter controls |
| `GlossaryLayout` | Glossary | Alphabetical index / Search / Term cards |

## Layout Rules

- Every Object type registers exactly one default layout
- Layouts can be overridden via frontmatter (`layout: alternative`)
- Layouts are responsive — they adapt to viewport without duplicate code
- The Layout Engine composes: Header + Main + Sidebar + Footer
- Sidebar content is auto-populated based on Object data (backlinks, related, TOC)
- Layouts never contain business logic — they are structural only
