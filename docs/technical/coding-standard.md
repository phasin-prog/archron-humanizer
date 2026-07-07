# Coding Standard

## Language

- **TypeScript** for all code — no plain JavaScript
- Strict mode enabled — `strict: true` in tsconfig
- No `any` — use `unknown` + type narrowing
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and utility types

## Naming

| Construct | Convention | Example |
|-----------|------------|---------|
| Files / folders | kebab-case | `knowledge-engine.ts` |
| Components | PascalCase | `ConceptCard.tsx` |
| Functions | camelCase | `getObjectBySlug()` |
| Hooks | camelCase + `use` | `useKnowledgeObject()` |
| Types / Interfaces | PascalCase | `KnowledgeObject` |
| Enums | PascalCase | `ContentStatus` |
| Constants | UPPER_SNAKE_CASE | `MAX_RESULTS_PER_PAGE` |
| Database columns | snake_case | `created_at` |
| Database tables | snake_case, plural | `concepts`, `timeline_events` |

## Imports

- Use package aliases: `@archron/renderer`, `@archron/knowledge-engine`
- No relative imports across packages
- Group imports: external → internal → relative
- No barrel files for deep imports — import directly from module

## Components

- Server Components by default in Next.js App Router
- Client Components only when interactivity is required
- Each component in its own file
- Props typed with `interface ComponentNameProps`
- No default exports — use named exports only
- Components are pure — no side effects in render

## Functions

- Pure functions preferred — no side effects unless necessary
- Async functions for all database and API operations
- Document parameters with JSDoc for public API functions
- Single responsibility — one function, one job

## Error Handling

- Use custom error classes for domain errors
- Never swallow errors — always handle or rethrow
- Server Actions return `{ success, data?, error? }` tuples
- Route Handlers return consistent error shapes
- All errors are logged via the logger

## Testing

- Vitest for unit tests
- Playwright for e2e tests (future)
- Test files colocated with source: `component.spec.ts`
- Test file suffix: `.spec.ts` or `.test.ts`

## Code Review Rules

- No PR without passing type check
- No PR without passing lint
- No PR without tests for new logic
- No `any` types allowed in merged code
- No commented-out code in merged code
