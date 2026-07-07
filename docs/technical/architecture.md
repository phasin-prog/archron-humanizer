# Technical Architecture

## 3.1 Monorepo Structure

```
archron/
├── apps/
│   ├── web/          Public-facing site (reader)
│   ├── studio/       Content management workspace
│   └── admin/        Administration panel
│
├── packages/
│   ├── ui/           Shared React components
│   ├── renderer/     Markdown → AST → React pipeline
│   ├── knowledge-engine/  Core business logic
│   ├── database/     Drizzle schema + migrations
│   ├── auth/         Authentication helpers
│   ├── search/       Search abstraction layer
│   ├── editor/       Markdown editor components
│   ├── graph/        Knowledge Graph visualization
│   └── shared/       Types, utils, constants
│
├── docs/
│
└── scripts/
```

Rationale: If a Mobile App or Desktop App is added in the future, all packages can be shared without duplication.

## 3.2 Application Architecture

```
Browser
    │
    ▼
Next.js
    │
    ▼
Route
    │
    ▼
Knowledge Engine
    │
    ▼
Repository
    │
    ▼
PostgreSQL
    │
    ▼
Supabase
```

### Rules

- Business Logic must never live inside React Components
- The Knowledge Engine is the single source of truth for all business operations
- Routes delegate to the Knowledge Engine — they do not contain logic
- Repositories abstract database access from the engine
