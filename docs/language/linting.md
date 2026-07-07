# Linting & Formatting

## ESLint

### Config

```javascript
// eslint.config.js
import archron from "@archron/eslint-config"

export default archron
```

### Rules (Shared)

```javascript
// packages/eslint-config/index.js
export default [
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // React (in apps with jsx)
      "react/jsx-no-useless-fragment": "error",
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": "error",
      "no-throw-literal": "error",
      "prefer-template": "error",
    }
  }
]
```

### Per-Package Overrides

```javascript
// packages/knowledge-engine/eslint.config.js
import archron from "@archron/eslint-config"

export default [
  ...archron,
  {
    rules: {
      "no-console": "error", // Knowledge Engine never logs directly
    }
  }
]
```

## Prettier

### Config

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Integration

```json
{
  "scripts": {
    "lint": "turbo lint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## CI Enforcement

| Check | Command | Fail on |
|-------|---------|---------|
| Lint | `turbo lint` | Any error |
| Format | `prettier --check .` | Any diff |
| Types | `turbo typecheck` | Any type error |
| Tests | `turbo test` | Any failing test |

Git hooks (future): `husky` + `lint-staged` runs lint + format on staged files only.
