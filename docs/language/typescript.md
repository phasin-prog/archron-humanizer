# TypeScript Configuration (v6.0)

## tsconfig Base

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",

    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,

    "paths": {
      "@archron/shared/*": ["./packages/shared/src/*"],
      "@archron/database/*": ["./packages/database/src/*"],
      "@archron/knowledge-engine/*": ["./packages/knowledge-engine/src/*"],
      "@archron/renderer/*": ["./packages/renderer/src/*"],
      "@archron/ui/*": ["./packages/ui/src/*"],
      "@archron/auth/*": ["./packages/auth/src/*"],
      "@archron/search/*": ["./packages/search/src/*"],
      "@archron/editor/*": ["./packages/editor/src/*"],
      "@archron/graph/*": ["./packages/graph/src/*"]
    }
  }
}
```

## Strict Rules

Every package enables the same strict set:

| Rule | Rationale |
|------|-----------|
| `noUncheckedIndexedAccess` | Prevents undefined access on arrays/objects |
| `exactOptionalPropertyTypes` | Catches undefined vs omitted distinction |
| `verbatimModuleSyntax` | Forces explicit `import type` vs `import` |
| `noUnusedLocals` | Dead code detection at compile time |
| `noUnusedParameters` | Dead parameters detected |
| `noUncheckedSideEffectImports` | Prevents accidental empty imports |

## Path Aliases

Every package has a `src/index.ts` barrel that exports its public API.

```typescript
// Import from outside the package
import { resolveObject } from "@archron/knowledge-engine"

// Import from inside the package
import { parseMarkdown } from "./parser"
```

Rules:

- Packages never import from each other's internal paths
- Only the barrel export is accessible from outside
- No deep imports like `@archron/knowledge-engine/src/internal`
- Each package's `package.json` has an `exports` field:

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  }
}
```

## Type Declaration Rules

| Construct | Rule |
|-----------|------|
| Interfaces | Prefer for object shapes |
| Types | Use for unions, intersections, primitives |
| Enums | Avoid — use `const` objects + `satisfies` |
| Generics | Default type parameter required unless obvious |
| `as` | Banned in application code. Use Zod/zod validation |
| `!` (non-null assertion) | Banned. Use early return + guard |
| `any` | Banned. Use `unknown` + type narrowing |
| `// @ts-ignore` | Banned. Use `// @ts-expect-error` with reason |
