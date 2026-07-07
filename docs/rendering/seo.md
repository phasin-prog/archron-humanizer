# SEO

The Renderer automatically generates all SEO metadata. Writers never write meta tags by hand.

## Auto-generated Metadata

### Open Graph

```html
<meta property="og:title" content="{object.title}" />
<meta property="og:description" content="{object.description}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://archron.com{object.slug}" />
<meta property="og:image" content="{object.thumbnail}" />
<meta property="og:locale" content="{object.language}" />
<meta property="og:site_name" content="ARCHRON" />
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{object.title}" />
<meta name="twitter:description" content="{object.description}" />
<meta name="twitter:image" content="{object.thumbnail}" />
```

### JSON-LD (Structured Data)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{object.title}",
  "description": "{object.description}",
  "author": {
    "@type": "Person",
    "name": "{object.author}"
  },
  "datePublished": "{object.created_at}",
  "dateModified": "{object.updated_at}",
  "inLanguage": "{object.language}"
}
```

### Schema Types by Object

| Object | Schema.org Type |
|--------|-----------------|
| Concept | `DefinedTerm` |
| Thinker | `Person` |
| Theory | `DefinedTermSet` |
| Book | `Book` |
| Article | `Article` |
| Symbol | `VisualArtwork` |
| Quote | `Quotation` |
| Guide | `LearningResource` |
| Timeline Event | `Event` |

## SEO Rules

- Every page gets a unique `<title>` — `{title} — ARCHRON`
- Every page gets `<meta name="description">` from object.description
- Canonical URL is always the object's permanent slug
- No duplicate content — every Object has exactly one URL
- Archived pages return `x-robots-tag: noindex` header
- Breadcrumb structured data for browse hierarchy
- Sitemap generated from published Object slugs
