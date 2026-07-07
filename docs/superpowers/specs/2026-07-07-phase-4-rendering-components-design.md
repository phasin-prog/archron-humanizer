# Phase 4 — Rendering Engine: Default Components — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Populate `DEFAULT_COMPONENTS` in `@archron/renderer` with 22 React components mapping to every AST node type. Each component renders semantic HTML styled with Archron Tailwind design tokens.

## File Structure

```
packages/renderer/src/
  components/
    index.ts              # CREATE — barrel export + DEFAULT_COMPONENTS map
    inline/
      text.tsx            # CREATE
      bold.tsx            # CREATE
      italic.tsx          # CREATE
      strikethrough.tsx   # CREATE
      code-inline.tsx     # CREATE
    block/
      heading.tsx         # CREATE
      paragraph.tsx       # CREATE
      blockquote.tsx      # CREATE
      code-block.tsx      # CREATE
      horizontal-rule.tsx # CREATE
      list.tsx            # CREATE
      list-item.tsx       # CREATE
      table.tsx           # CREATE
      table-row.tsx       # CREATE
      table-cell.tsx      # CREATE
    rich/
      link.tsx            # CREATE
      image.tsx           # CREATE
      wiki-link.tsx       # CREATE
      callout.tsx         # CREATE
      footnote.tsx        # CREATE
    structural/
      root.tsx            # CREATE
      embed.tsx           # CREATE
  registry/
    components.ts         # MODIFY — populate DEFAULT_COMPONENTS
  index.ts                # MODIFY — re-export default components
```

Total: 18 new component files + 1 barrel + 2 modified files = 21 files

---

## Component Specs

Every component receives `ComponentProps = { node: ASTNode; children?: ReactNode; context?: PipelineContext }`.

### Inline Components (5)

#### Text — `components/inline/text.tsx`
```
Renders: <span>{node.value}</span>
Props: node.value = string
```
No Tailwind — bare span. This is the atomic text leaf.

#### Bold — `components/inline/bold.tsx`
```
Renders: <strong className="font-semibold">{children}</strong>
Props: children from recursive render
```

#### Italic — `components/inline/italic.tsx`
```
Renders: <em className="italic">{children}</em>
```

#### Strikethrough — `components/inline/strikethrough.tsx`
```
Renders: <del className="line-through decoration-2">{children}</del>
```

#### CodeInline — `components/inline/code-inline.tsx`
```
Renders: <code className="rounded bg-muted px-1 py-0.5 text-caption font-mono text-[0.875em]">{node.value}</code>
Props: node.value = string
```

---

### Block Components (10)

#### Heading — `components/block/heading.tsx`
```
Renders: <h{depth} className={HEADING_STYLES[depth]}>{children}</h>

HEADING_STYLES map:
  1 → "text-display font-serif font-bold tracking-tight"
  2 → "text-page-title font-serif font-semibold"
  3 → "text-section font-serif font-semibold"
  4 → "text-card-title font-sans font-semibold"
  5 → "text-body font-sans font-medium"
  6 → "text-caption font-sans font-medium uppercase tracking-wider"

depth พัง: <h6> default, log warning
```

#### Paragraph — `components/block/paragraph.tsx`
```
Renders: <p className="text-body leading-relaxed mb-4 last:mb-0">{children}</p>
```

#### Blockquote — `components/block/blockquote.tsx`
```
Renders: <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-4 text-muted-foreground italic">{children}</blockquote>
```

#### CodeBlock — `components/block/code-block.tsx`
```
Renders:
<div className="relative my-4 rounded-lg border bg-surface">
  <div className="flex items-center justify-between px-4 py-1.5 border-b bg-muted/50">
    <span className="text-xs font-mono text-muted-foreground">{node.language ?? "text"}</span>
  </div>
  <pre className="overflow-x-auto p-4">
    <code className="text-caption font-mono">{node.value}</code>
  </pre>
</div>
Props: node.value = code string, node.language? = language name

node.language null → แสดง "text"
```

#### HorizontalRule — `components/block/horizontal-rule.tsx`
```
Renders: <hr className="my-8 border-border" />
```

#### List — `components/block/list.tsx`
```
Renders: node.ordered ? <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol> : <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>
Props: node.ordered = boolean, children = <li> array
```

#### ListItem — `components/block/list-item.tsx`
```
Renders: <li className="text-body">{children}</li>
```

#### Table — `components/block/table.tsx`
```
Renders: <div className="overflow-x-auto my-4 rounded-lg border"><table className="w-full text-body">{children}</table></div>
```

#### TableRow — `components/block/table-row.tsx`
```
Renders: <tr className="border-b last:border-0">{children}</tr>
```

#### TableCell — `components/block/table-cell.tsx`
```
Renders: <td className="px-4 py-2 border-r last:border-0">{children}</td>
```

---

### Rich Components (5)

#### Link — `components/rich/link.tsx`
```
Renders:
<a
  href={node.url}
  className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary text-primary transition-colors"
  target={isExternal ? "_blank" : undefined}
  rel={isExternal ? "noopener noreferrer" : undefined}
>
  {children}
</a>

isExternal = node.url?.startsWith("http")
```

#### Image — `components/rich/image.tsx`
```
Renders:
<figure className="my-6">
  <img
    src={node.url}
    alt={node.alt ?? ""}
    className="rounded-lg w-full"
  />
  {node.title && <figcaption className="text-caption text-muted-foreground mt-2 text-center">{node.title}</figcaption>}
</figure>
Props: node.url, node.alt, node.title
```

#### WikiLink — `components/rich/wiki-link.tsx`
```
Renders:
- If node.data.resolved type = "concept" → <ConceptCard slug={resolvedSlug} />
- If node.data.resolved type = "thinker" → <ThinkerCard slug={resolvedSlug} />
- Default → <a href={`/${resolvedSlug}`} className="underline">{alias ?? resolvedTitle}</a>

Props: node = WikiLinkNode { target, alias?, resolvedSlug?, resolvedTitle?, resolvedType? }

Imports ConceptCard, ThinkerCard จาก @archron/ui
ถ้า resolvedSlug ไม่มี → แสดง <span className="text-muted-foreground">[[{target}]]</span> (unresolved state)
```

#### Callout — `components/rich/callout.tsx`
```
Renders:
<aside className={calloutVariants[variant]}>
  <div className="flex gap-3">
    <span className="text-lg">{icon}</span>
    <div>{children}</div>
  </div>
</aside>

variant from node.data?.variant: "info" | "warning" | "tip" | "note"
default: "info"

calloutVariants:
- info: "border-l-4 border-primary/60 bg-primary/5 rounded-r-lg p-4 my-4"
- warning: "border-l-4 border-amber-500/60 bg-amber-50 rounded-r-lg p-4 my-4 dark:bg-amber-950/20"
- tip: "border-l-4 border-emerald-500/60 bg-emerald-50 rounded-r-lg p-4 my-4 dark:bg-emerald-950/20"
- note: "border-l-4 border-muted-foreground/30 bg-surface rounded-r-lg p-4 my-4"

icons:
- info: ℹ
- warning: ⚠
- tip: 💡
- note: 📝
```

#### Footnote — `components/rich/footnote.tsx`
```
Renders:
<sup>
  <a href={`#fn-${node.data?.index}`} id={`fnref-${node.data?.index}`} className="text-xs text-primary no-underline hover:underline">
    [{node.data?.index ?? "?"}]
  </a>
</sup>

Props: node.data?.index = number (footnote counter)
```

---

### Structural Components (2)

#### Root — `components/structural/root.tsx`
```
Renders: <article className="prose-container">{children}</article>
Note: "prose-container" ไม่อยู่ใน globals.css ต้องเพิ่มเป็น utility class หรือใช้ existing container class
```

#### Embed — `components/structural/embed.tsx`
```
Renders:
<div className="rounded-lg border bg-surface p-4 my-4 text-center text-muted-foreground text-caption">
  [Embed: {node.data?.url ?? "unknown"}]
</div>

Props: node.data?.url = string
```

---

## DEFAULT_COMPONENTS Map

In `registry/components.ts`, replace `const DEFAULT_COMPONENTS: ComponentMap = {}` with:

```ts
import { Text } from "../components/inline/text"
import { Bold } from "../components/inline/bold"
// ... all 22 imports ...

const DEFAULT_COMPONENTS: ComponentMap = {
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

---

## Tailwind Token Reference

Tokens ที่มีอยู่แล้วใน `apps/web/src/styles/globals.css` @theme:

| Token | ใช้ใน |
|-------|-------|
| `font-sans`, `font-serif`, `font-mono` | headings, code, body |
| `text-display`, `text-page-title`, `text-section`, `text-card-title`, `text-body`, `text-caption`, `text-meta` | typography scale |
| `bg-surface`, `bg-muted` | code blocks, callouts, embeds |
| `text-muted-foreground` | secondary text |
| `text-primary` | links, headings |
| `border-primary`, `border-border`, `border-muted-foreground` | blockquotes, tables, rules |
| `rounded`, `rounded-lg`, `rounded-r-lg` | various |

Tokens ต้องเพิ่ม (ถ้ายังไม่มี):
- `bg-primary/5`, `bg-primary/60` (opacity variants for callouts) — Tailwind มีอยู่แล้ว
- `decoration-primary/40`, `decoration-primary` — Tailwind มีอยู่แล้ว
- `dark:` variants — Tailwind มีอยู่แล้ว

---

## Multi-Agent Execution Plan

3 agents parallel (files are independent):

| Agent | Files | Count |
|-------|-------|-------|
| Agent A | `components/inline/*` (5 files) + `components/block/*` (10 files) | 15 |
| Agent B | `components/rich/*` (5 files) + `components/structural/*` (2 files) | 7 |
| Agent C | `components/index.ts` + modify `registry/components.ts` + modify `index.ts` | 3 |

Agents A+B parallel → Agent C last

---

## Acceptance Criteria

- [ ] All 22 components registered in DEFAULT_COMPONENTS
- [ ] `pnpm --filter @archron/renderer typecheck` passes
- [ ] WikiLink renders ConceptCard/ThinkerCard when resolved
- [ ] WikiLink renders unresolved placeholder when slug missing
- [ ] Callout has 4 variants (info, warning, tip, note)
- [ ] CodeBlock shoes language label
- [ ] Heading uses correct h1-h6 based on depth
- [ ] No circular dependencies (components/inline ← → components/rich)
- [ ] All imports resolve
