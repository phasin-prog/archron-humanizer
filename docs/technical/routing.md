# Dynamic Routing

## Route Map

```
/                                  Homepage
/concept/[slug]                    Concept page
/thinker/[slug]                    Thinker page
/theory/[slug]                     Theory page
/school/[slug]                     School page
/book/[slug]                       Book page
/article/[slug]                    Article page
/symbol/[slug]                     Symbol page
/timeline/[slug]                   Timeline Event page
/quote/[slug]                      Quote page
/guide/[slug]                      Guide page
/collection/[slug]                 Collection page
/glossary/[slug]                   Glossary page

/browse/[domain]                   Browse by Discipline
/browse/[domain]/[school]          Browse by School
/browse/[domain]/[school]/[theory] Browse by Theory

/search                            Search page
/timeline                          Full Timeline view
/graph                             Knowledge Graph
/profile/[username]                User Profile

/studio                            Studio Dashboard
/editor/new/[type]                 Create new Object
/editor/[id]                       Edit Draft
/admin                             Admin Panel
```

## Routing Rules

- All entity routes use `[slug]` — never `[id]`
- Slugs are immutable after publish
- Unknown slugs return 404 with related content suggestions
- Browse routes use server-side pagination
- Editor and Admin routes require authentication
- Studio routes check Role before rendering
