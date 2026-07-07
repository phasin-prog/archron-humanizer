# Phase 7 — Public Platform: Full — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Build all public-facing pages in `apps/web/` — reading layout, search, explore, guides, timeline, constellation, companion. ~25 files.

## Pages

### 1. Reading Layout — `app/[...slug]/page.tsx`
Dynamic catch-all route. Renders any knowledge object (concept, thinker, article, book, symbol, etc.)

Layout: Breadcrumb → Definition (sticky) → Content + Sidebar
Sidebar: Related Concepts, Thinkers, Books, Timeline, References
Content: Rendered via @archron/renderer (MD → React)

### 2. Search — `app/search/page.tsx`
Results grouped by object type. Facet filters. Load More pagination.
API: `app/search/autocomplete/route.ts` — GET with query param, returns grouped results

### 3. Explore — `app/explore/page.tsx` + `[discipline]/page.tsx`
Landing: Domain grid with counts. Drill-down: discipline → schools → thinkers → timeline

### 4. Guides — `app/guides/page.tsx`
List of learning guides with lesson counts, estimated hours, domain badges

### 5. Timeline — `app/timeline/page.tsx`
Horizontal scrollable timeline with era markers and event cards

### 6. Constellation — `app/constellation/page.tsx`
Interactive knowledge graph visualization using @archron/graph (Canvas 2D)

### 7. Companion — `app/companion/page.tsx`
AI chat interface placeholder — text input, message history, suggestion chips

## Components

```
components/
  reading/
    reading-sidebar.tsx      Related content sidebar
    definition-bar.tsx       Sticky definition strip
  search/
    autocomplete-popup.tsx   Dropdown autocomplete
    search-filters.tsx       Type/sort filter bar
  explore/
    domain-grid.tsx          12 domain cards with counts
    school-card.tsx          School preview card
  timeline/
    timeline-track.tsx       Scrollable timeline
  constellation/
    constellation-scene.tsx  Graph visualization
```

## Multi-Agent Groups

| Agent | Features | Files |
|-------|----------|-------|
| A | Reading Layout + Components | 4 |
| B | Search + Autocomplete | 4 |
| C | Explore + Guides | 5 |
| D | Timeline + Constellation | 4 |
| E | Companion + remaining pages | 3 |

All 5 agents create independent files → full parallel dispatch.
