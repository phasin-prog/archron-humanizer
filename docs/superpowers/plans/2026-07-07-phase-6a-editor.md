# Phase 6a — TipTap Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 7 React TipTap editor components + 1 state hook in @archron/editor.

**Architecture:** TipTap (ProseMirror) core editor with Archron extensions — slash commands, wikilink autocomplete, live preview, toolbar, status bar, 3-panel layout.

**Tech Stack:** React, TipTap (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-markdown), @archron/ui, @archron/renderer, @archron/shared

## Global Constraints

- All components are React functional components with TypeScript
- Use cn() from @archron/ui for className merging
- TipTap editor instance uses useEditor() hook from @tiptap/react
- "use client" directive on files using React hooks/state
- verbatimModuleSyntax: true, strict: true
- Keep existing exports in index.ts — append new ones

---

## Parallel Execution

```
Task 0 (dependencies) → Task 1-4 in parallel → Task 5 (barrel)
```

Task 0 must finish first (installs TipTap packages). Tasks 1-4 are independent.

---

### Task 0: Install TipTap Dependencies

**Files:**
- Modify: `packages/editor/package.json`

- [ ] **Step 1: Add TipTap dependencies**

Edit `packages/editor/package.json`, add to dependencies section:

```json
"@tiptap/extension-code-block-lowlight": "^2",
"@tiptap/extension-highlight": "^2",
"@tiptap/extension-markdown": "^2",
"@tiptap/extension-placeholder": "^2",
"@tiptap/pm": "^2",
"@tiptap/react": "^2",
"@tiptap/starter-kit": "^2"
```

- [ ] **Step 2: Install**

```bash
pnpm install --filter @archron/editor
```

Expected: Packages install without errors.

- [ ] **Step 3: Commit**

```bash
git add packages/editor/package.json pnpm-lock.yaml
git commit -m "chore(editor): add TipTap dependencies — react, starter-kit, markdown, highlight, placeholder, pm"
```

---

### Task 1: EditorCore

**Files:**
- Create: `packages/editor/src/editor-core.tsx`

- [ ] **Step 1: Create packages/editor/src/editor-core.tsx**

```tsx
"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "@tiptap/extension-markdown"
import Placeholder from "@tiptap/extension-placeholder"
import Highlight from "@tiptap/extension-highlight"
import { cn } from "@archron/ui"

export interface EditorCoreProps {
  content?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
  editorRef?: React.MutableRefObject<Editor | null>
}

export function EditorCore({
  content = "",
  onChange,
  placeholder = "เริ่มเขียนที่นี่...",
  readOnly = false,
  className,
  editorRef,
}: EditorCoreProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: false,
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({ placeholder }),
      Highlight,
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown?.getMarkdown?.() ?? editor.getText()
      onChange?.(md)
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral max-w-none outline-none min-h-[400px] p-6 text-body",
          "font-sans text-body leading-relaxed",
          className,
        ),
      },
    },
  })

  React.useEffect(() => {
    if (editorRef) editorRef.current = editor
  }, [editor, editorRef])

  if (!editor) return null

  return <EditorContent editor={editor} />
}
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm --filter @archron/editor typecheck
```

- [ ] **Step 3: Commit**

```bash
git add packages/editor/src/editor-core.tsx
git commit -m "feat(editor): add EditorCore — TipTap instance with markdown, placeholder, highlight"
```

---

### Task 2: SlashCommandMenu + WikiLinkAutocomplete

**Files:**
- Create: `packages/editor/src/slash-command-menu.tsx`
- Create: `packages/editor/src/wikilink-autocomplete.tsx`

- [ ] **Step 1: Create packages/editor/src/slash-command-menu.tsx**

```tsx
"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import type { Editor } from "@tiptap/react"
import { cn } from "@archron/ui"
import { BUILT_IN_SLASH_COMMANDS, type SlashCommand } from "./index"

export interface SlashCommandMenuProps {
  editor: Editor
  commands?: SlashCommand[]
}

export function SlashCommandMenu({
  editor,
  commands = BUILT_IN_SLASH_COMMANDS,
}: SlashCommandMenuProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = commands.filter(
    (c) =>
      c.trigger.toLowerCase().includes(query.toLowerCase()) ||
      c.label.toLowerCase().includes(query.toLowerCase()),
  )

  const insertSnippet = useCallback(
    (cmd: SlashCommand) => {
      const snippet = cmd.snippet.replace(/\$\{\d+:(.*?)\}/g, "$1")
      editor.chain().focus().insertContent(snippet).run()
      setOpen(false)
      setQuery("")
    },
    [editor],
  )

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "/" && !open) {
        const { from } = editor.state.selection
        const $pos = editor.state.doc.resolve(from)
        const textBefore = $pos.parent.textContent.slice(0, $pos.parentOffset)
        if (textBefore === "" || textBefore.endsWith(" ")) {
          const rect = editor.view.coordsAtPos(from)
          setPosition({ x: rect.left, y: rect.bottom + 4 })
          setOpen(true)
          setQuery("")
          setSelectedIndex(0)
          return
        }
      }
      if (!open) return
      if (event.key === "Escape") {
        setOpen(false)
        setQuery("")
        editor.commands.focus()
        return
      }
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (event.key === "Enter" && filtered[selectedIndex]) {
        event.preventDefault()
        insertSnippet(filtered[selectedIndex])
        return
      }
      if (event.key.length === 1) {
        setQuery((q) => q + event.key)
        setSelectedIndex(0)
        return
      }
      if (event.key === "Backspace") {
        setQuery((q) => q.slice(0, -1))
        setSelectedIndex(0)
        return
      }
    }

    window.addEventListener("keydown", handler, true)
    return () => window.removeEventListener("keydown", handler, true)
  }, [editor, open, query, selectedIndex, filtered, insertSnippet])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div
        ref={menuRef}
        className="fixed z-50 w-72 rounded-lg border bg-surface shadow-lg overflow-hidden"
        style={{ left: position.x, top: position.y }}
      >
        <div className="p-2 border-b">
          <input
            type="text"
            value={`/${query}`}
            onChange={(e) => {
              const val = e.target.value
              setQuery(val.startsWith("/") ? val.slice(1) : val)
            }}
            className="w-full text-caption outline-none bg-transparent"
            placeholder="Search commands..."
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <div className="px-2 py-3 text-caption text-muted-foreground text-center">
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => insertSnippet(cmd)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-body hover:bg-muted transition-colors",
                i === selectedIndex && "bg-muted",
              )}
            >
              <span className="text-caption text-muted-foreground w-16">{cmd.trigger}</span>
              <span className="flex-1">{cmd.label}</span>
              <span className="text-caption text-muted-foreground">{cmd.category}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create packages/editor/src/wikilink-autocomplete.tsx**

```tsx
"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import type { Editor } from "@tiptap/react"
import { cn } from "@archron/ui"

export interface WikiLinkResult {
  slug: string
  title: string
  objectType: string
}

export interface WikiLinkAutocompleteProps {
  editor: Editor
  onSearch?: (query: string) => Promise<WikiLinkResult[]>
}

export function WikiLinkAutocomplete({
  editor,
  onSearch,
}: WikiLinkAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<WikiLinkResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const search = useCallback(
    async (q: string) => {
      if (onSearch) {
        const r = await onSearch(q)
        setResults(r)
      }
    },
    [onSearch],
  )

  const insertWikiLink = useCallback(
    (item: WikiLinkResult) => {
      const text = item.title === item.slug ? `[[${item.slug}]]` : `[[${item.slug}|${item.title}]]`
      editor.chain().focus().insertContent(text).run()
      setOpen(false)
      setQuery("")
      setResults([])
    },
    [editor],
  )

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "[" && !open) {
        const { from } = editor.state.selection
        const textBefore = editor.state.doc.textBetween(Math.max(0, from - 2), from)
        if (textBefore === "[[" || textBefore.endsWith("[")) {
          const rect = editor.view.coordsAtPos(from)
          setPosition({ x: rect.left, y: rect.bottom + 4 })
          setOpen(true)
          setQuery("")
          setSelectedIndex(0)
          search("")
          return
        }
      }
      if (!open) return
      if (event.key === "Escape") {
        setOpen(false)
        setQuery("")
        editor.commands.focus()
        return
      }
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
        return
      }
      if ((event.key === "Enter" || event.key === "Tab") && results[selectedIndex]) {
        event.preventDefault()
        insertWikiLink(results[selectedIndex])
        return
      }
      if (event.key.length === 1) {
        const q = query + event.key
        setQuery(q)
        search(q)
        setSelectedIndex(0)
        return
      }
      if (event.key === "Backspace") {
        const q = query.slice(0, -1)
        setQuery(q)
        search(q)
        setSelectedIndex(0)
        return
      }
    }

    window.addEventListener("keydown", handler, true)
    return () => window.removeEventListener("keydown", handler, true)
  }, [editor, open, query, results, selectedIndex, search, insertWikiLink])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div
        className="fixed z-50 w-80 rounded-lg border bg-surface shadow-lg overflow-hidden"
        style={{ left: position.x, top: position.y }}
      >
        <div className="max-h-64 overflow-y-auto p-1">
          {results.length === 0 && (
            <div className="px-2 py-3 text-caption text-muted-foreground text-center">
              {query ? "No matches" : "Start typing..."}
            </div>
          )}
          {results.map((item, i) => (
            <button
              key={item.slug}
              onClick={() => insertWikiLink(item)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-muted transition-colors",
                i === selectedIndex && "bg-muted",
              )}
            >
              <span className="text-caption text-muted-foreground w-20">{item.objectType}</span>
              <span className="flex-1 text-body">{item.title}</span>
              <span className="text-caption text-muted-foreground">{item.slug}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm --filter @archron/editor typecheck
```

- [ ] **Step 4: Commit**

```bash
git add packages/editor/src/slash-command-menu.tsx packages/editor/src/wikilink-autocomplete.tsx
git commit -m "feat(editor): add SlashCommandMenu and WikiLinkAutocomplete"
```

---

### Task 3: EditorToolbar + StatusBar + LivePreview

**Files:**
- Create: `packages/editor/src/editor-toolbar.tsx`
- Create: `packages/editor/src/status-bar.tsx`
- Create: `packages/editor/src/live-preview.tsx`

- [ ] **Step 1: Create packages/editor/src/editor-toolbar.tsx**

```tsx
"use client"

import React from "react"
import type { Editor } from "@tiptap/react"
import { cn } from "@archron/ui"

interface ToolbarButton {
  label: string
  icon: string
  action: () => void
  isActive: () => boolean
}

export interface EditorToolbarProps {
  editor: Editor
  className?: string
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  const buttons: ToolbarButton[] = [
    { label: "H1", icon: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
    { label: "H2", icon: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
    { label: "H3", icon: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
    { label: "Bold", icon: "B", action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
    { label: "Italic", icon: "I", action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
    { label: "Strike", icon: "S", action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
    { label: "Code", icon: "<>", action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive("code") },
    { label: "Quote", icon: '"', action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote") },
    { label: "Bullet", icon: "•", action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
    { label: "Ordered", icon: "1.", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
    { label: "HR", icon: "—", action: () => editor.chain().focus().setHorizontalRule().run(), isActive: () => false },
    { label: "CodeBlock", icon: "{ }", action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: () => editor.isActive("codeBlock") },
    { label: "Undo", icon: "↩", action: () => editor.chain().focus().undo().run(), isActive: () => false },
    { label: "Redo", icon: "↪", action: () => editor.chain().focus().redo().run(), isActive: () => false },
  ]

  return (
    <div className={cn("flex items-center gap-0.5 p-1 border-b bg-muted/30 overflow-x-auto", className)}>
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={cn(
            "rounded px-2 py-1 text-caption font-medium hover:bg-muted transition-colors",
            btn.isActive() && "bg-muted text-primary",
          )}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create packages/editor/src/status-bar.tsx**

```tsx
import React from "react"
import { cn } from "@archron/ui"

export interface StatusBarProps {
  wordCount: number
  readingTime: number
  lastSaved?: Date | null
  status?: string
  referenceCount?: number
  className?: string
}

export function StatusBar({
  wordCount,
  readingTime,
  lastSaved,
  status = "draft",
  referenceCount = 0,
  className,
}: StatusBarProps) {
  const ago = lastSaved
    ? (() => {
        const diff = Math.round((Date.now() - lastSaved.getTime()) / 1000)
        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.round(diff / 60)}m ago`
        return `${Math.round(diff / 3600)}h ago`
      })()
    : "not saved"

  return (
    <div className={cn("flex items-center gap-4 px-4 py-1.5 border-t text-caption text-muted-foreground bg-muted/20", className)}>
      <span className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "published" && "bg-success/10 text-success",
        status === "review" && "bg-warning/10 text-warning",
        status === "draft" && "bg-muted text-muted-foreground",
        status === "archived" && "bg-destructive/10 text-destructive",
      )}>
        {status}
      </span>
      <span>Words: {wordCount.toLocaleString()}</span>
      <span>Reading: {readingTime}m</span>
      <span>Refs: {referenceCount}</span>
      <span className="ml-auto">Saved: {ago}</span>
    </div>
  )
}
```

- [ ] **Step 3: Create packages/editor/src/live-preview.tsx**

```tsx
"use client"

import React, { useMemo } from "react"
import { cn } from "@archron/ui"

export interface LivePreviewProps {
  markdown: string
  className?: string
}

export function LivePreview({ markdown, className }: LivePreviewProps) {
  const html = useMemo(() => {
    const lines = markdown.split("\n")
    return lines
      .map((line) => {
        if (/^#{1,6}\s/.test(line)) {
          const level = line.match(/^(#{1,6})\s/)![1].length
          const text = line.replace(/^#{1,6}\s/, "")
          return `<h${level} class="text-${["display","page-title","section","card-title","body","caption"][level-1] ?? "body"} font-serif font-bold mb-2">${text}</h${level}>`
        }
        if (/^>\s/.test(line)) return `<blockquote class="border-l-4 border-primary/30 pl-4 py-1 my-2 text-muted-foreground italic">${line.replace(/^>\s/, "")}</blockquote>`
        if (/^-{3,}$/.test(line)) return `<hr class="my-4 border-border" />`
        if (/^\*\*.*\*\*$/.test(line)) return `<p class="text-body font-semibold mb-2">${line.replace(/\*\*/g, "")}</p>`
        if (/^\*.*\*$/.test(line) && !/^\*\*/.test(line)) return `<p class="text-body italic mb-2">${line.replace(/\*/g, "")}</p>`
        if (/^`/.test(line)) return `<code class="rounded bg-muted px-1 py-0.5 text-caption font-mono">${line.replace(/`/g, "")}</code>`
        if (line.trim() === "") return `<br />`
        return `<p class="text-body leading-relaxed mb-2">${line}</p>`
      })
      .join("\n")
  }, [markdown])

  return (
    <div
      className={cn("prose max-w-none p-6 text-body leading-relaxed", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **Step 4: Verify typecheck**

```bash
pnpm --filter @archron/editor typecheck
```

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/editor-toolbar.tsx packages/editor/src/status-bar.tsx packages/editor/src/live-preview.tsx
git commit -m "feat(editor): add EditorToolbar, StatusBar, and LivePreview"
```

---

### Task 4: useEditorState + EditorLayout

**Files:**
- Create: `packages/editor/src/use-editor-state.ts`
- Create: `packages/editor/src/editor-layout.tsx`

- [ ] **Step 1: Create packages/editor/src/use-editor-state.ts**

```ts
"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { createInitialState, countWords, estimateReadingTime, type EditorState } from "./index"

export function useEditorState(initial?: Partial<EditorState>) {
  const [state, setState] = useState<EditorState>(createInitialState(initial))
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const setContent = useCallback((markdown: string) => {
    setState((s) => ({
      ...s,
      markdown,
      wordCount: countWords(markdown),
    }))
  }, [])

  const setTitle = useCallback((title: string) => {
    setState((s) => ({ ...s, title }))
  }, [])

  const setStatus = useCallback((status: EditorState["status"]) => {
    setState((s) => ({ ...s, status }))
  }, [])

  const addTag = useCallback((tag: string) => {
    setState((s) => s.tags.includes(tag) ? s : { ...s, tags: [...s.tags, tag] })
  }, [])

  const removeTag = useCallback((tag: string) => {
    setState((s) => ({ ...s, tags: s.tags.filter((t) => t !== tag) }))
  }, [])

  const save = useCallback(async () => {
    setState((s) => ({ ...s, lastSaved: new Date().toISOString() }))
    return state
  }, [state])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState((s) => ({ ...s, lastSaved: new Date().toISOString() }))
    }, 30000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return {
    state,
    setContent,
    setTitle,
    setStatus,
    addTag,
    removeTag,
    save,
    readingTime: estimateReadingTime(state.wordCount),
  }
}
```

- [ ] **Step 2: Create packages/editor/src/editor-layout.tsx**

```tsx
import React from "react"
import { cn } from "@archron/ui"

export interface EditorLayoutProps {
  children: React.ReactNode
  sidebarVisible?: boolean
  className?: string
}

export function EditorLayout({
  children,
  sidebarVisible = true,
  className,
}: EditorLayoutProps) {
  const [left, center, right] = React.Children.toArray(children)

  return (
    <div className={cn("flex h-full min-h-screen bg-background", className)}>
      {left && (
        <aside className="hidden lg:flex w-60 shrink-0 border-r bg-muted/10 flex-col overflow-y-auto">
          {left}
        </aside>
      )}
      <main className="flex-1 flex flex-col min-w-0">
        {center}
      </main>
      {right && sidebarVisible && (
        <aside className="hidden xl:flex w-72 shrink-0 border-l bg-muted/10 flex-col overflow-y-auto">
          {right}
        </aside>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm --filter @archron/editor typecheck
```

- [ ] **Step 4: Commit**

```bash
git add packages/editor/src/use-editor-state.ts packages/editor/src/editor-layout.tsx
git commit -m "feat(editor): add useEditorState hook and EditorLayout"
```

---

### Task 5: Update barrel exports

**Files:**
- Modify: `packages/editor/src/index.ts`

- [ ] **Step 1: Add new exports to packages/editor/src/index.ts**

Append to existing file:

```ts
export { EditorCore } from "./editor-core"
export type { EditorCoreProps } from "./editor-core"
export { SlashCommandMenu } from "./slash-command-menu"
export type { SlashCommandMenuProps } from "./slash-command-menu"
export { WikiLinkAutocomplete } from "./wikilink-autocomplete"
export type { WikiLinkAutocompleteProps, WikiLinkResult } from "./wikilink-autocomplete"
export { EditorToolbar } from "./editor-toolbar"
export type { EditorToolbarProps } from "./editor-toolbar"
export { StatusBar } from "./status-bar"
export type { StatusBarProps } from "./status-bar"
export { LivePreview } from "./live-preview"
export type { LivePreviewProps } from "./live-preview"
export { EditorLayout } from "./editor-layout"
export type { EditorLayoutProps } from "./editor-layout"
export { useEditorState } from "./use-editor-state"
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm --filter @archron/editor typecheck
```

- [ ] **Step 3: Commit**

```bash
git add packages/editor/src/index.ts
git commit -m "feat(editor): export all editor components from barrel"
```
