# Monorepo — Turborepo

## Pipeline

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "inputs": ["src/**", "tsconfig.json"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "vitest.config.ts"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Build Graph

```
turbo run build
```

Executes in dependency order:

```
1. shared     (leaf — no deps)
2. database   (depends on shared)
3. auth       (depends on shared)
4. search     (depends on shared, database)
5. renderer   (depends on shared)
6. ui         (depends on shared)
7. editor     (depends on shared, ui)
8. graph      (depends on shared)
9. knowledge-engine (depends on shared, database, auth, search)
10. web       (depends on all packages)
11. studio    (depends on all packages)
12. admin     (depends on all packages)
```

## Caching

| Input | Cache Key |
|-------|-----------|
| Source files | Hash of `src/**` |
| Config files | Hash of `tsconfig.json`, `turbo.json` |
| Dependencies | Hash of `pnpm-lock.yaml` |
| Environment | Selected env vars |

Turborepo caches `dist/`, `.next/`, and build artifacts. Cache is stored locally and optionally in remote cache (Vercel or self-hosted).

## Remote Caching

- Enabled via Vercel Remote Caching (default) or self-hosted cache server
- Team-shared cache — teammates never rebuild what others built
- Public: `turbo login` + `turbo link`
- CI: auto-detected via VERCEL_TOKEN or `TURBO_API` / `TURBO_TOKEN` for self-hosted

## Task Commands

```bash
pnpm dev              # turbo dev — all packages in watch
pnpm build            # turbo build — all packages
pnpm lint             # turbo lint — all packages
pnpm typecheck        # turbo typecheck — all packages
pnpm test             # turbo test — all packages
pnpm test -- --filter=@archron/knowledge-engine  # single package
pnpm clean            # turbo clean — delete all dist
```
