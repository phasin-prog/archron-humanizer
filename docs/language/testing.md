# Testing — Vitest

## Config

```typescript
// vitest.config.ts — Vitest v4
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/index.ts"],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

## Per-Package Setup

```typescript
// packages/knowledge-engine/vitest.config.ts
import { defineConfig } from "vitest/config"
import base from "@archron/vitest"

export default defineConfig({
  ...base,
  test: {
    ...base.test,
    environment: "node",
  },
})
```

## Test Patterns

### Unit Tests

```typescript
// packages/knowledge-engine/src/resolver.test.ts
import { describe, it, expect } from "vitest"
import { resolveObject } from "./resolver"

describe("resolveObject", () => {
  it("returns object for valid slug", async () => {
    const result = await resolveObject("shadow", "concept")
    expect(result).toBeDefined()
    expect(result.slug).toBe("shadow")
  })

  it("throws for unknown slug", async () => {
    await expect(resolveObject("nonexistent", "concept")).rejects.toThrow("Object not found")
  })
})
```

### Component Tests (with React Testing Library)

```typescript
// packages/ui/src/ConceptCard.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ConceptCard } from "./ConceptCard"

describe("ConceptCard", () => {
  it("renders title and description", () => {
    render(<ConceptCard title="Shadow" description="An unconscious archetype" slug="shadow" />)
    expect(screen.getByText("Shadow")).toBeDefined()
    expect(screen.getByText("An unconscious archetype")).toBeDefined()
  })
})
```

## Test Patterns to Follow

| Pattern | Description |
|---------|-------------|
| **Arrange-Act-Assert** | Every test follows AAA structure |
| **Describe-It** | Nest `describe` for context, `it` for behavior |
| **No mocks by default** | Mock only external IO (DB, network) |
| **Factory functions** | `createMockConcept()` over inline objects |
| **Test behavior, not implementation** | Test what it does, not how |

## Coverage Targets

| Package | Coverage |
|---------|----------|
| `@archron/knowledge-engine` | 90%+ |
| `@archron/renderer` | 85%+ |
| `@archron/database` | 85%+ |
| `@archron/search` | 80%+ |
| `@archron/auth` | 85%+ |
| `@archron/shared` | 90%+ |
| `@archron/ui` | 80%+ |

## CI

```bash
pnpm test
```

Runs all package tests via Turborepo. Coverage reports uploaded as CI artifacts.
