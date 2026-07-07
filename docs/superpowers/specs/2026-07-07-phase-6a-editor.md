# Phase 6a — Editor Package: TipTap React Editor — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Build a production-grade Markdown editor using TipTap (ProseMirror) in `@archron/editor`. 7 React components forming the ARCHRON editor experience.

## Dependencies

Add to `packages/editor/package.json`:

```json
"@tiptap/react": "^2",
"@tiptap/starter-kit": "^2",
"@tiptap/extension-markdown": "^2",
"@tiptap/extension-placeholder": "^2",
"@tiptap/extension-highlight": "^2",
"@tiptap/extension-code-block-lowlight": "^2",
"@tiptap/pm": "^2"
```

Existing: `@archron/shared`, `@archron/ui`, `@archron/renderer`, `@archron/knowledge-engine`, `@archron/database`

---

## File Structure

```
packages/editor/src/
  index.ts                     # MODIFY — re-export all new components
  editor-core.tsx              # CREATE — TipTap editor instance
  editor-layout.tsx            # CREATE — 3-panel layout
  slash-command-menu.tsx       # CREATE — / command palette
  wikilink-autocomplete.tsx    # CREATE — [[ object search
  editor-toolbar.tsx           # CREATE — formatting toolbar
  live-preview.tsx             # CREATE — rendered preview via @archron/renderer
  status-bar.tsx               # CREATE — word count, reading time, save
  use-editor-state.ts          # CREATE — state management hook
```

Total: 8 files (1 + 7 new + 1 hook)

---

## Component Specs

### 1. EditorCore — `editor-core.tsx`

```
Purpose: TipTap editor instance with markdown support

Props:
  content?: string           — initial markdown
  onChange?: (markdown: string) => void
  placeholder?: string
  readOnly?: boolean

Extensions:
  StarterKit (headings, lists, bold, italic, code, blockquote, hr)
  Markdown (bi-directional: markdown ↔ ProseMirror)
  Placeholder
  Highlight
  CodeBlockLowlight

Returns: <EditorContent editor={editor} /> with Archron Tailwind typography

Keyboard shortcuts:
  Ctrl+B → bold
  Ctrl+I → italic
  Ctrl+K → link (use TipTap built-in)
  Tab → indent list
  Shift+Tab → unindent list
```

### 2. EditorLayout — `editor-layout.tsx`

```
Purpose: 3-panel container

Props:
  children: [left, center, right]  — or explicit slots
  sidebarVisible?: boolean

Layout (CSS Grid):
  ┌──────────┬─────────────────┬──────────┐
  │ Navigator │ Editor+Preview  │ Knowledge│
  │ 240px     │ flex-1          │ 280px    │
  └──────────┴─────────────────┴──────────┘

Responsive: mobile stacks vertically, sidebar togglable
```

### 3. SlashCommandMenu — `slash-command-menu.tsx`

```
Purpose: / command palette triggered by typing /

Props:
  editor: Editor              — TipTap editor instance
  commands?: SlashCommand[]   — defaults to BUILT_IN_SLASH_COMMANDS

Behavior:
  Listens for "/" key in editor
  Shows floating popup with searchable list
  Arrow keys navigate, Enter selects, Esc dismisses
  On select: inserts snippet at cursor position

Uses: Command component from @archron/ui for the popup UI
```

### 4. WikiLinkAutocomplete — `wikilink-autocomplete.tsx`

```
Purpose: [[ autocomplete for knowledge objects

Props:
  editor: Editor
  onSearch?: (query: string) => Promise<{slug: string, title: string, objectType: string}[]>

Behavior:
  Listens for "[[" in editor
  Shows floating popup with fuzzy-matched objects
  Tab/Enter autocompletes → [[slug|title]]
  Esc dismisses

Default onSearch: calls KnowledgeEngine search (if provided)
```

### 5. EditorToolbar — `editor-toolbar.tsx`

```
Purpose: Fixed formatting toolbar above editor

Props:
  editor: Editor

Buttons (icon + tooltip + active state):
  H1, H2, H3        — toggleHeading({ level })
  Bold, Italic       — toggleBold(), toggleItalic()
  Strikethrough      — toggleStrike()
  Inline Code        — toggleCode()
  Blockquote         — toggleBlockquote()
  Bullet List        — toggleBulletList()
  Ordered List       — toggleOrderedList()
  Horizontal Rule    — setHorizontalRule()
  Code Block         — toggleCodeBlock()
  Undo, Redo         — undo(), redo()

Uses: Tooltip, Button from @archron/ui
Active state: bg-muted when format is active
```

### 6. LivePreview — `live-preview.tsx`

```
Purpose: Rendered preview of current markdown

Props:
  markdown: string
  resolver?: WikiLinkResolver   — from @archron/renderer

Behavior:
  Uses RenderPipeline from @archron/renderer
  Passes markdown through → renders to React nodes
  Shows in scrollable panel

Mode: toggle (edit only / preview only / side-by-side)
```

### 7. StatusBar — `status-bar.tsx`

```
Purpose: Bottom bar showing document stats

Props:
  wordCount: number
  readingTime: number
  lastSaved?: Date | null
  status?: string
  references?: number

Displays:
  Status badge | Words: 1,240 | Reading: 5m | References: 3 | Saved: 2 min ago
```

### 8. useEditorState — `use-editor-state.ts`

```
Purpose: React hook managing editor state

Returns:
  state: EditorState (from existing type)
  setContent: (markdown: string) => void
  setTitle: (title: string) => void
  setStatus: (status: string) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  save: () => Promise<void>

Auto-save: every 30 seconds via useEffect + setInterval
Uses: existing createInitialState, countWords, estimateReadingTime, validateMarkdown
```

---

## Package Exports

`packages/editor/src/index.ts` — keep existing + add:

```ts
export { EditorCore } from "./editor-core"
export { EditorLayout } from "./editor-layout"
export { SlashCommandMenu } from "./slash-command-menu"
export { WikiLinkAutocomplete } from "./wikilink-autocomplete"
export { EditorToolbar } from "./editor-toolbar"
export { LivePreview } from "./live-preview"
export { StatusBar } from "./status-bar"
export { useEditorState } from "./use-editor-state"
```

---

## Multi-Agent Execution

4 agents parallel (independent components):

| Agent | Components | Files |
|-------|-----------|-------|
| A | EditorCore + EditorLayout | 2 |
| B | SlashCommandMenu + WikiLinkAutocomplete | 2 |
| C | EditorToolbar + StatusBar + LivePreview | 3 |
| D | useEditorState + barrel + package.json | 2 + 1 + 1 |

---

## Acceptance Criteria

- [ ] TipTap renders markdown content correctly
- [ ] SlashCommandMenu opens on `/` and inserts snippet
- [ ] WikiLinkAutocomplete opens on `[[` and suggests objects
- [ ] EditorToolbar buttons toggle formatting
- [ ] LivePreview renders markdown via @archron/renderer
- [ ] StatusBar shows real-time word count and reading time
- [ ] Auto-save fires every 30 seconds
- [ ] `pnpm --filter @archron/editor typecheck` passes
- [ ] No conflicts with existing types/exports
