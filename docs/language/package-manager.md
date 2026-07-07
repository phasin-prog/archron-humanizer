# Package Manager — pnpm v11

## Workspace Setup

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Workspace Protocol

Dependencies between local packages use the `workspace:` protocol:

```json
// packages/knowledge-engine/package.json
{
  "dependencies": {
    "@archron/shared": "workspace:*",
    "@archron/database": "workspace:*",
    "@archron/auth": "workspace:*"
  }
}
```

## Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "clean": "turbo clean"
  }
}
```

## Dependency Rules

| Action | Rule |
|--------|------|
| Add dep to one package | `pnpm add lodash --filter @archron/renderer` |
| Add dev dep to one package | `pnpm add -D vitest --filter @archron/renderer` |
| Add dep to root | `pnpm add -w typescript` |
| Update all deps | `pnpm up --latest` |
| List outdated | `pnpm outdated -r` |

## .npmrc

```
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=true
save-exact=true
```

## Lockfile

- `pnpm-lock.yaml` is committed to the repository
- Lockfile changes are reviewed like code changes
- `pnpm install --frozen-lockfile` in CI
