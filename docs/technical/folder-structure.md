# Folder Convention

## Per-App Convention

Every app follows this structure:

```
app/
├── features/       Feature-specific modules
├── entities/       Knowledge object pages (concept, thinker, etc.)
├── components/     Shared app components
├── lib/            Utility functions
├── hooks/          React hooks
├── renderer/       Rendering integration
├── knowledge/      Knowledge Engine client
├── studio/         Studio integration
├── editor/         Editor integration
├── server/         Server-only modules
├── database/       Database client
└── types/          TypeScript type definitions
```

## Example: web/app

```
web/app/
├── features/
│   ├── search/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── page.tsx
│   └── timeline/
│       ├── components/
│       ├── hooks/
│       └── page.tsx
│
├── entities/
│   ├── concept/
│   ├── thinker/
│   ├── book/
│   ├── article/
│   ├── symbol/
│   └── guide/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   └── common/
│
├── lib/
├── hooks/
├── renderer/
├── knowledge/
├── studio/
├── editor/
├── server/
├── database/
└── types/
```

## Convention Rules

- Feature directories are colocated — components, hooks, and types live next to their page
- Shared code lives in `@archron/shared` or the relevant `@archron/*` package
- No circular dependencies between packages
- Every package has a `index.ts` barrel export
- Types are defined close to their usage, not in a global types folder
