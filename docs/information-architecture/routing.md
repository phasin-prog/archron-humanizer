# URL Philosophy

A Route is not a folder. A Route is an Identity.

## Route Patterns

| Pattern | Example |
|---------|---------|
| `/concept/:slug` | `/concept/shadow` |
| `/thinker/:slug` | `/thinker/carl-jung` |
| `/theory/:slug` | `/theory/psychological-types` |
| `/school/:slug` | `/school/analytical-psychology` |
| `/book/:slug` | `/book/psychological-types` |
| `/article/:slug` | `/article/introversion` |
| `/symbol/:slug` | `/symbol/mandala` |
| `/timeline/:slug` | `/timeline/interpretation-of-dreams-published` |
| `/quote/:slug` | `/quote/shadow-is-a-moral-problem` |
| `/collection/:slug` | `/collection/jung-beginners` |
| `/guide/:slug` | `/guide/introduction-to-analytical-psychology` |
| `/glossary/:slug` | `/glossary/analytical-psychology` |

## Browse Routes

| Pattern | Description |
|---------|-------------|
| `/browse/:domain` | List schools in a domain |
| `/browse/:domain/:school` | List theories in a school |
| `/browse/:domain/:school/:theory` | List concepts in a theory |

## Special Routes

| Route | Description |
|-------|-------------|
| `/search` | Search page |
| `/timeline` | Full timeline view |
| `/graph` | Knowledge Graph visualization |
| `/studio` | Content management workspace |
| `/profile/:username` | User profile |

## Slug Rules

- Slugs are immutable once published
- Slugs are lowercase, hyphen-separated
- Slugs use English for root object names
- Aliases provide alternate lookup paths (including Thai)
- Redirects exist for renamed objects (301 permanent)
