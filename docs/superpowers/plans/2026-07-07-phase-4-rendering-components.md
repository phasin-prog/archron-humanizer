# Phase 4 — Rendering Default Components — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 22 React components for all AST node types in `@archron/renderer` DEFAULT_COMPONENTS map.

**Architecture:** One component per AST node type. Semantic HTML + Archron Tailwind tokens. Pure functional components receiving `ComponentProps`.

**Tech Stack:** React, TypeScript, Tailwind CSS, @archron/ui (for wiki_link), @archron/shared

## Global Constraints

- Every component is `(props: ComponentProps) => ReactNode`
- ComponentProps = `{ node: ASTNode; children?: ReactNode; context?: PipelineContext }`
- Tailwind tokens reference existing `globals.css` @theme values
- verbatimModuleSyntax: true — use import type for type-only imports
- tsconfig.json has strict: true
- No circular dependencies between groups

---

## Parallel Execution Map

```
Task 1 (inline — 5 files) ──┐
Task 2 (block — 10 files) ──┼──► Task 4 (registry + barrels — 3 files)
Task 3 (rich + structural — 7 files) ┘
```

---

### Task 1: Inline Components (5 files)

**Files:**
- Create: `packages/renderer/src/components/inline/text.tsx`
- Create: `packages/renderer/src/components/inline/bold.tsx`
- Create: `packages/renderer/src/components/inline/italic.tsx`
- Create: `packages/renderer/src/components/inline/strikethrough.tsx`
- Create: `packages/renderer/src/components/inline/code-inline.tsx`

**Interfaces:**
- Consumes: `ComponentProps` from `../../types`
- Produces: `Text`, `Bold`, `Italic`, `Strikethrough`, `CodeInline` — default-exported React functional components

- [ ] **Step 1: Create packages/renderer/src/components/inline/text.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Text({ node }: ComponentProps) {
  return <span>{node.value}</span>
}
```

- [ ] **Step 2: Create packages/renderer/src/components/inline/bold.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Bold({ children }: ComponentProps) {
  return <strong className="font-semibold">{children}</strong>
}
```

- [ ] **Step 3: Create packages/renderer/src/components/inline/italic.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Italic({ children }: ComponentProps) {
  return <em className="italic">{children}</em>
}
```

- [ ] **Step 4: Create packages/renderer/src/components/inline/strikethrough.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Strikethrough({ children }: ComponentProps) {
  return <del className="line-through decoration-2">{children}</del>
}
```

- [ ] **Step 5: Create packages/renderer/src/components/inline/code-inline.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function CodeInline({ node }: ComponentProps) {
  return (
    <code className="rounded bg-muted px-1 py-0.5 text-caption font-mono text-[0.875em]">
      {node.value}
    </code>
  )
}
```

- [ ] **Step 6: Verify typecheck**

```bash
pnpm --filter @archron/renderer typecheck
```

Expected: PASS for all 5 files.

- [ ] **Step 7: Commit**

```bash
git add packages/renderer/src/components/inline/
git commit -m "feat(renderer): add inline components — text, bold, italic, strikethrough, code-inline"
```

---

### Task 2: Block Components (10 files)

**Files:**
- Create: `packages/renderer/src/components/block/heading.tsx`
- Create: `packages/renderer/src/components/block/paragraph.tsx`
- Create: `packages/renderer/src/components/block/blockquote.tsx`
- Create: `packages/renderer/src/components/block/code-block.tsx`
- Create: `packages/renderer/src/components/block/horizontal-rule.tsx`
- Create: `packages/renderer/src/components/block/list.tsx`
- Create: `packages/renderer/src/components/block/list-item.tsx`
- Create: `packages/renderer/src/components/block/table.tsx`
- Create: `packages/renderer/src/components/block/table-row.tsx`
- Create: `packages/renderer/src/components/block/table-cell.tsx`

**Interfaces:**
- Consumes: `ComponentProps` from `../../types`
- Produces: 10 default-exported React components

- [ ] **Step 1: Create packages/renderer/src/components/block/heading.tsx**

```tsx
import type { ComponentProps } from "../../types"

const STYLES: Record<number, string> = {
  1: "text-display font-serif font-bold tracking-tight",
  2: "text-page-title font-serif font-semibold",
  3: "text-section font-serif font-semibold",
  4: "text-card-title font-sans font-semibold",
  5: "text-body font-sans font-medium",
  6: "text-caption font-sans font-medium uppercase tracking-wider",
}

export default function Heading({ node, children }: ComponentProps) {
  const depth = node.depth ?? 1
  const Tag = `h${Math.min(Math.max(depth, 1), 6)}` as keyof JSX.IntrinsicElements
  const className = STYLES[depth] ?? STYLES[6]
  return <Tag className={className}>{children}</Tag>
}
```

- [ ] **Step 2: Create packages/renderer/src/components/block/paragraph.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Paragraph({ children }: ComponentProps) {
  return <p className="text-body leading-relaxed mb-4 last:mb-0">{children}</p>
}
```

- [ ] **Step 3: Create packages/renderer/src/components/block/blockquote.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Blockquote({ children }: ComponentProps) {
  return (
    <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-4 text-muted-foreground italic">
      {children}
    </blockquote>
  )
}
```

- [ ] **Step 4: Create packages/renderer/src/components/block/code-block.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function CodeBlock({ node }: ComponentProps) {
  return (
    <div className="relative my-4 rounded-lg border bg-surface">
      <div className="flex items-center justify-between px-4 py-1.5 border-b bg-muted/50">
        <span className="text-xs font-mono text-muted-foreground">
          {node.language ?? "text"}
        </span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-caption font-mono">{node.value}</code>
      </pre>
    </div>
  )
}
```

- [ ] **Step 5: Create packages/renderer/src/components/block/horizontal-rule.tsx**

```tsx
export default function HorizontalRule() {
  return <hr className="my-8 border-border" />
}
```

- [ ] **Step 6: Create packages/renderer/src/components/block/list.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function List({ node, children }: ComponentProps) {
  if (node.ordered) {
    return <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>
  }
  return <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>
}
```

- [ ] **Step 7: Create packages/renderer/src/components/block/list-item.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function ListItem({ children }: ComponentProps) {
  return <li className="text-body">{children}</li>
}
```

- [ ] **Step 8: Create packages/renderer/src/components/block/table.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Table({ children }: ComponentProps) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border">
      <table className="w-full text-body">{children}</table>
    </div>
  )
}
```

- [ ] **Step 9: Create packages/renderer/src/components/block/table-row.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function TableRow({ children }: ComponentProps) {
  return <tr className="border-b last:border-0">{children}</tr>
}
```

- [ ] **Step 10: Create packages/renderer/src/components/block/table-cell.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function TableCell({ children }: ComponentProps) {
  return <td className="px-4 py-2 border-r last:border-0">{children}</td>
}
```

- [ ] **Step 11: Verify typecheck**

```bash
pnpm --filter @archron/renderer typecheck
```

Expected: PASS for all 10 files.

- [ ] **Step 12: Commit**

```bash
git add packages/renderer/src/components/block/
git commit -m "feat(renderer): add block components — heading, paragraph, blockquote, code-block, hr, list, table"
```

---

### Task 3: Rich + Structural Components (7 files)

**Files:**
- Create: `packages/renderer/src/components/rich/link.tsx`
- Create: `packages/renderer/src/components/rich/image.tsx`
- Create: `packages/renderer/src/components/rich/wiki-link.tsx`
- Create: `packages/renderer/src/components/rich/callout.tsx`
- Create: `packages/renderer/src/components/rich/footnote.tsx`
- Create: `packages/renderer/src/components/structural/root.tsx`
- Create: `packages/renderer/src/components/structural/embed.tsx`

**Interfaces:**
- Consumes: `ComponentProps`, `WikiLinkNode` from `../../types`, `ConceptCard`, `ThinkerCard` from `@archron/ui`
- Produces: `Link`, `Image`, `WikiLink`, `Callout`, `Footnote`, `Root`, `Embed`

- [ ] **Step 1: Create packages/renderer/src/components/rich/link.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Link({ node, children }: ComponentProps) {
  const url = node.url ?? "#"
  const isExternal = url.startsWith("http")
  return (
    <a
      href={url}
      className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary text-primary transition-colors"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  )
}
```

- [ ] **Step 2: Create packages/renderer/src/components/rich/image.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Image({ node }: ComponentProps) {
  return (
    <figure className="my-6">
      <img src={node.url} alt={node.alt ?? ""} className="rounded-lg w-full" />
      {node.title && (
        <figcaption className="text-caption text-muted-foreground mt-2 text-center">
          {node.title}
        </figcaption>
      )}
    </figure>
  )
}
```

- [ ] **Step 3: Create packages/renderer/src/components/rich/wiki-link.tsx**

```tsx
import type { ComponentProps, WikiLinkNode } from "../../types"

export default function WikiLink({ node }: ComponentProps) {
  const wl = node as WikiLinkNode
  if (!wl.resolvedSlug) {
    return (
      <span className="text-muted-foreground">
        [[{wl.target}]]
      </span>
    )
  }
  if (wl.resolvedType === "concept") {
    return (
      <div className="my-4">
        <div className="rounded-lg border bg-surface p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Concept
          </div>
          <a
            href={`/${wl.resolvedSlug}`}
            className="text-card-title font-serif font-semibold text-primary underline underline-offset-2 hover:decoration-primary"
          >
            {wl.alias ?? wl.resolvedTitle ?? wl.target}
          </a>
          {wl.resolvedTitle && wl.alias && (
            <div className="text-caption text-muted-foreground mt-1">
              {wl.resolvedTitle}
            </div>
          )}
        </div>
      </div>
    )
  }
  if (wl.resolvedType === "thinker") {
    return (
      <div className="my-4">
        <div className="rounded-lg border bg-surface p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Thinker
          </div>
          <a
            href={`/${wl.resolvedSlug}`}
            className="text-card-title font-serif font-semibold text-primary underline underline-offset-2 hover:decoration-primary"
          >
            {wl.alias ?? wl.resolvedTitle ?? wl.target}
          </a>
        </div>
      </div>
    )
  }
  return (
    <a
      href={`/${wl.resolvedSlug}`}
      className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary text-primary transition-colors"
    >
      {wl.alias ?? wl.resolvedTitle ?? wl.target}
    </a>
  )
}
```

- [ ] **Step 4: Create packages/renderer/src/components/rich/callout.tsx**

```tsx
import type { ComponentProps } from "../../types"

type CalloutVariant = "info" | "warning" | "tip" | "note"

const VARIANT_STYLES: Record<CalloutVariant, string> = {
  info: "border-l-4 border-primary/60 bg-primary/5 rounded-r-lg p-4 my-4",
  warning: "border-l-4 border-amber-500/60 bg-amber-50 rounded-r-lg p-4 my-4 dark:bg-amber-950/20",
  tip: "border-l-4 border-emerald-500/60 bg-emerald-50 rounded-r-lg p-4 my-4 dark:bg-emerald-950/20",
  note: "border-l-4 border-muted-foreground/30 bg-surface rounded-r-lg p-4 my-4",
}

const ICONS: Record<CalloutVariant, string> = {
  info: "\u2139",
  warning: "\u26A0",
  tip: "\uD83D\uDCA1",
  note: "\uD83D\uDCDD",
}

export default function Callout({ node, children }: ComponentProps) {
  const variant: CalloutVariant = (node.data?.variant as CalloutVariant) ?? "info"
  return (
    <aside className={VARIANT_STYLES[variant]}>
      <div className="flex gap-3">
        <span className="text-lg" aria-hidden="true">{ICONS[variant]}</span>
        <div>{children}</div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 5: Create packages/renderer/src/components/rich/footnote.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Footnote({ node }: ComponentProps) {
  const index = node.data?.index as number | undefined
  return (
    <sup>
      <a
        href={`#fn-${index}`}
        id={`fnref-${index}`}
        className="text-xs text-primary no-underline hover:underline"
      >
        [{index ?? "?"}]
      </a>
    </sup>
  )
}
```

- [ ] **Step 6: Create packages/renderer/src/components/structural/root.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Root({ children }: ComponentProps) {
  return <article>{children}</article>
}
```

- [ ] **Step 7: Create packages/renderer/src/components/structural/embed.tsx**

```tsx
import type { ComponentProps } from "../../types"

export default function Embed({ node }: ComponentProps) {
  return (
    <div className="rounded-lg border bg-surface p-4 my-4 text-center text-muted-foreground text-caption">
      [Embed: {String(node.data?.url ?? "unknown")}]
    </div>
  )
}
```

- [ ] **Step 8: Verify typecheck**

```bash
pnpm --filter @archron/renderer typecheck
```

Expected: PASS for all 7 files.

- [ ] **Step 9: Commit**

```bash
git add packages/renderer/src/components/rich/ packages/renderer/src/components/structural/
git commit -m "feat(renderer): add rich and structural components — link, image, wiki-link, callout, footnote, root, embed"
```

---

### Task 4: Registry + Barrel + Integration (3 files)

**Files:**
- Create: `packages/renderer/src/components/index.ts`
- Modify: `packages/renderer/src/registry/components.ts`
- Modify: `packages/renderer/src/index.ts`

**Interfaces:**
- Consumes: All 22 component exports from Tasks 1-3
- Produces: `DEFAULT_COMPONENTS` map (22 entries), barrel export file, package root re-exports

- [ ] **Step 1: Create packages/renderer/src/components/index.ts**

```ts
import Text from "./inline/text"
import Bold from "./inline/bold"
import Italic from "./inline/italic"
import Strikethrough from "./inline/strikethrough"
import CodeInline from "./inline/code-inline"
import Heading from "./block/heading"
import Paragraph from "./block/paragraph"
import Blockquote from "./block/blockquote"
import CodeBlock from "./block/code-block"
import HorizontalRule from "./block/horizontal-rule"
import List from "./block/list"
import ListItem from "./block/list-item"
import Table from "./block/table"
import TableRow from "./block/table-row"
import TableCell from "./block/table-cell"
import Link from "./rich/link"
import Image from "./rich/image"
import WikiLink from "./rich/wiki-link"
import Callout from "./rich/callout"
import Footnote from "./rich/footnote"
import Root from "./structural/root"
import Embed from "./structural/embed"

export const DEFAULT_COMPONENTS = {
  root: Root,
  heading: Heading,
  paragraph: Paragraph,
  text: Text,
  bold: Bold,
  italic: Italic,
  strikethrough: Strikethrough,
  code_inline: CodeInline,
  code_block: CodeBlock,
  blockquote: Blockquote,
  list: List,
  list_item: ListItem,
  link: Link,
  image: Image,
  horizontal_rule: HorizontalRule,
  table: Table,
  table_row: TableRow,
  table_cell: TableCell,
  wiki_link: WikiLink,
  callout: Callout,
  footnote: Footnote,
  embed: Embed,
}
```

- [ ] **Step 2: Modify packages/renderer/src/registry/components.ts**

Replace `const DEFAULT_COMPONENTS: ComponentMap = {}` with the import and assignment from `../components`:

```ts
import type { ComponentType } from "react"
import type { ComponentMap, ComponentProps } from "../types"
import { DEFAULT_COMPONENTS as defaults } from "../components"

export function createComponentRegistry(): ComponentMap {
  return { ...defaults }
}

export type ComponentRegistry = Map<string, ComponentType<ComponentProps>>
```

- [ ] **Step 3: Modify packages/renderer/src/index.ts**

Add after the existing exports (before the last line):

```ts
export { DEFAULT_COMPONENTS } from "./components"
```

- [ ] **Step 4: Verify typecheck passes on renderer**

```bash
pnpm --filter @archron/renderer typecheck
```

Expected: PASS with zero errors.

- [ ] **Step 5: Verify full workspace typecheck**

```bash
pnpm typecheck
```

Expected: All packages that were passing before continue to pass.

- [ ] **Step 6: Commit**

```bash
git add packages/renderer/src/components/index.ts packages/renderer/src/registry/components.ts packages/renderer/src/index.ts
git commit -m "feat(renderer): register 22 default components and wire into createComponentRegistry"
```

---

## Execution Order

1. **Dispatch Tasks 1-3 in parallel** (inline, block, rich+structural — no shared files)
2. **Verify combined typecheck** (`pnpm --filter @archron/renderer typecheck`)
3. **Dispatch Task 4** (barrels + registry)

**Final check:** `pnpm typecheck` across all packages
