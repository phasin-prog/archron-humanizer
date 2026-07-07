# PostCSS & Build

## PostCSS Configuration

```javascript
// postcss.config.js
export default {
  plugins: {
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## package.json (scripts)

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "clean": "turbo clean"
  }
}
```

## Next.js Configuration (v16)

```javascript
// apps/web/next.config.ts
import type { NextConfig } from "next"

const config: NextConfig = {
  transpilePackages: [
    "@archron/ui",
    "@archron/renderer",
    "@archron/knowledge-engine",
    "@archron/editor",
    "@archron/graph",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
}

export default config
```

## TypeScript Configs

### Root

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  }
}
```

### App (web, studio, admin)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@archron/shared/*": ["../../packages/shared/src/*"],
      "@archron/ui/*": ["../../packages/ui/src/*"],
      // ... per-app aliases
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### Package

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Environment Variables

```bash
# .env.local (app-level)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

```bash
# .env (root — shared)
NODE_VERSION=24
```

## VSCode Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```
