# MDX

Markdown + JSX = embedded components in content.

## Where MDX Fits

ARCHRON has two rendering paths:

| Path | Content | Engine |
|------|---------|--------|
| **Knowledge Objects** | Concepts, Thinkers, Books (structured) | Custom Renderer + Wikilinks |
| **Articles & Guides** | Long-form, freeform writing | MDX + Custom Renderer |

MDX is for **Articles and Guides** — writer-created content that needs inline interactive components. Knowledge Objects (Concept, Thinker, Book) use the structured Renderer with wikilinks.

## Setup

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react --filter web
```

```typescript
// apps/web/next.config.ts
import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
})

const config: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@archron/ui", "@archron/renderer"],
}

export default withMDX(config)
```

```typescript
// apps/web/src/app/articles/[slug]/mdx-components.tsx
// Components available in MDX content
import type { MDXComponents } from "mdx/types"
import {
  ConceptCard,
  ThinkerLink,
  BookReference,
  QuoteBlock,
  SymbolDisplay,
  TimelineInline,
  Callout,
  Accordion,
  Tabs,
  Figure,
  TableOfContents,
} from "@archron/ui"

export function useMDXComponents(): MDXComponents {
  return {
    ConceptCard,
    ThinkerLink,
    BookReference,
    QuoteBlock,
    SymbolDisplay,
    TimelineInline,
    Callout,
    Accordion,
    Tabs,
    Figure,
    TableOfContents,
    TOC: TableOfContents,
    wrapper: ({ children }) => <article className="prose">{children}</article>,
  }
}
```

## MDX + Custom Renderer Integration

ARCHRON's custom wikilink syntax (`[[concept:shadow]]`) and MDX work together:

```mdx
# Understanding the Shadow

## Definition

The shadow is an unconscious aspect of the personality.

<ConceptCard slug="shadow" variant="inline" />

## Related Content

- <ThinkerLink slug="carl-jung" /> first described this concept
- See <BookReference slug="man-and-his-symbols" /> for deeper reading

## Key Points

<Accordion title="Historical Context">
  Jung developed this concept between 1912 and 1945.
  <TimelineInline slug="shadow-development" />
</Accordion>
```

## Available Components in MDX

All registered Renderer components are available:

| Component | MDX Tag | Props |
|-----------|---------|-------|
| Concept Card | `<ConceptCard />` | `slug`, `variant` |
| Thinker Link | `<ThinkerLink />` | `slug`, `children` |
| Book Reference | `<BookReference />` | `slug` |
| Quote Block | `<QuoteBlock />` | `slug` |
| Symbol Display | `<SymbolDisplay />` | `slug` |
| Timeline (inline) | `<TimelineInline />` | `slug`, `years` |
| Callout | `<Callout />` | `type`, `title`, `children` |
| Accordion | `<Accordion />` | `title`, `children` |
| Tabs | `<Tabs />` | `tabs`, `children` |
| Figure | `<Figure />` | `src`, `alt`, `caption` |
| Table of Contents | `<TOC />` | — (auto from headings) |
| Knowledge Graph | `<KnowledgeGraph />` | `slug` |
| Quiz | `<Quiz />` | `questions` |

## When to Use MDX vs Wikilinks

| Use Case | Tool | Reason |
|----------|------|--------|
| Reference a Concept inline | `[[concept:shadow]]` | Simpler, auto-resolved |
| Embed a full Concept card with customization | `<ConceptCard slug="shadow" variant="detailed" />` | More control |
| Quick link to a Thinker | `[[thinker:carl-jung]]` | Minimal syntax |
| Embed with custom styling | `<ThinkerLink slug="carl-jung">Read about Jung</ThinkerLink>` | Custom children |
| Static content | Plain Markdown | Fastest, no JS |
| Interactive content (quiz, accordion) | MDX components | Needs JS hydration |

## Rules

- MDX files go in `apps/web/src/content/` (separate from the Renderer pipeline)
- Wikilinks are resolved at render time in both MDX and Markdown
- MDX components are Server Components by default — add `"use client"` only for interactivity
- No arbitrary React imports in MDX — only registered components
- MDX content is rendered via ISR (same as other content)
- Writers use `[[wikilinks]]` in Studio; MDX is for advanced/technical writers
