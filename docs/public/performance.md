# Performance

The public platform must be fast. Not "fast enough" — genuinely fast.

## Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Desktop & Mobile |
| FCP (First Contentful Paint) | < 1.5s | Desktop & Mobile |
| TBT (Total Blocking Time) | < 100ms | Desktop & Mobile |
| CLS (Cumulative Layout Shift) | < 0.1 | Desktop & Mobile |
| INP (Interaction to Next Paint) | < 200ms | Desktop & Mobile |
| JS per page | < 100KB | Initial load |
| Total page weight | < 500KB | Including images |

## Strategies

### Rendering Strategy by Page Type

| Page Type | Strategy | Reason |
|-----------|----------|--------|
| Homepage | Static (SSG) + ISR hourly | Content changes rarely |
| Object pages | ISR (on-demand revalidation) | Updates on publish |
| Articles | ISR (on-demand revalidation) | Updates on publish |
| Search results | Server-side (SSR) | Dynamic per query |
| Explore / Browse | Static (SSG) + ISR daily | Content changes rarely |
| Timeline | Static (SSG) + ISR daily | Content changes rarely |
| Constellation | Client-side + static data | Interactive only |
| Guide pages | ISR (on-demand revalidation) | Updates on edit |
| User Profile | Server-side (SSR) | Dynamic per user |
| Studio | Client-side (CSR) | App-like experience |

### Streaming

- Use React Suspense boundaries for progressive rendering
- Hero section streams first, sidebar loads later
- Related content is deferred — not in the initial render
- Comments (future) are loaded after the main content

### Partial Hydration

- Island architecture for interactive components
- Static content (90% of most pages) has zero JS
- Only interactive islands hydrate:
  - Search bar
  - Knowledge Graph
  - Companion
  - Timeline controls
  - Collection save button
- Everything else is static HTML + CSS

### Lazy Loading

| Asset | Strategy |
|-------|----------|
| Images | `loading="lazy"` + `next/image` with WebP |
| Knowledge Graph | Loaded on first click |
| Companion | Loaded on first click |
| Timeline | Loaded when in viewport |
| Related content | Deferred after main content |
| Font files | `font-display: swap` + subsetted fonts |
| Third-party scripts | Zero third-party scripts on initial load |

### Caching

| Layer | Strategy | Duration |
|-------|----------|----------|
| Next.js (ISR) | On-demand revalidation | Until next publish |
| Cloudflare CDN | Cache HTML + assets | 1 hour (static), 10 min (ISR) |
| Browser cache | CSS, JS, fonts | 1 year (fingerprinted) |
| Image CDN | Supabase Storage CDN | 1 year |
| API responses | `stale-while-revalidate` | 5 min stale, 1 hour max |

### Image Optimization

- All images served via `next/image` (WebP format)
- Automatic resizing per viewport
- Lazy loading below the fold
- No background images in CSS — always `<img>` tags
- Icons: SVGs inline or sprite sheet (no icon font)

### JavaScript Budget

| Chunk | Max Size | Notes |
|-------|----------|-------|
| Framework (React + Next) | ~40KB gzip | Shared across pages |
| Renderer core | ~15KB gzip | AST → Component mapping |
| Markdown parser | ~10KB gzip | Loaded on content pages only |
| Knowledge Graph | ~50KB gzip | Loaded on interaction |
| Companion | ~20KB gzip | Loaded on interaction |
| Studio bundle | ~150KB gzip | Loaded on /studio routes only |
| **Total (public)** | **< 100KB** | Initial page load |

## Performance Rules

- No page should require JavaScript to render text content
- No render-blocking resources
- Font files are self-hosted — no Google Fonts API call
- All images specify width + height to prevent layout shift
- No runtime bloat — tree-shake unused code
- Performance budgets are enforced in CI/CD (failing build if exceeded)
- Regular Lighthouse audits in CI
- RUM (Real User Monitoring) via Vercel Analytics
