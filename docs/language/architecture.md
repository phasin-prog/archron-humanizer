# Language System

TypeScript · Node.js · Next.js · Three.js · Toolchain

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript (strict) | ^6.0 |
| Runtime | Node.js | >= 24 LTS |
| Framework | Next.js (App Router) | ^16 |
| 3D / Viz | Three.js | ^0.185 |
| Package Manager | pnpm | ^11 |
| Monorepo | Turborepo | ^2 |
| Testing | Vitest | ^4 |
| Linting | ESLint + typescript-eslint | ^10 |
| Formatting | Prettier | ^3 |
| ORM | Drizzle ORM | ^0.45 |
| Chain | Drizzle Kit | ^0.31 |
| Database | PostgreSQL + PL/pgSQL | 17 |
| Auth | Clerk | ^7 |

## Monorepo Architecture

```
archron/
├── apps/
│   ├── web/          Next.js (public site)
│   ├── studio/       Next.js (content workspace)
│   └── admin/        Next.js (admin panel)
│
├── packages/
│   ├── ui/           Shared React components
│   ├── renderer/     Markdown → AST → Components
│   ├── knowledge-engine/  Core business logic
│   ├── database/     Drizzle schema + migrations
│   ├── auth/         Auth helpers + middleware
│   ├── search/       Search abstraction
│   ├── editor/       Editor components
│   ├── graph/        Three.js Knowledge Graph
│   └── shared/       Types, utils, constants
│
├── docs/
├── scripts/
└── turbo.json
```

## Configuration Strategy

### Single Source of Truth

```
tsconfig.json              (base)
├── apps/web/tsconfig.json     (extends)
├── apps/studio/tsconfig.json  (extends)
├── packages/renderer/tsconfig (extends)
└── packages/shared/tsconfig   (extends)
```

### Shared Config Packages

```
@archron/tsconfig      — Base TS configs
@archron/eslint-config — Shared ESLint rules
@archron/prettier      — Shared Prettier config
@archron/vitest        — Shared test setup
```

## Dependency Rules

| Direction | Allowed? | Note |
|-----------|----------|------|
| app → package | ✓ | Normal |
| package → app | ✗ | Never |
| package → package | ✓ | Only via public API |
| app → app | ✗ | No cross-app deps |
| shared → anything | ✓ | Shared is leaf node |
| database → knowledge-engine | ✗ | DB package is leaf |

## Build Order (Turborepo)

```
shared → database → auth → search → renderer → ui → editor → graph → knowledge-engine
                                                                           │
                                    ┌──────────────────────────────────────┘
                                    ▼
                    web     studio     admin
```
