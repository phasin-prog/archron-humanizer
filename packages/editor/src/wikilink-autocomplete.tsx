"use client"

import React, { useState, useEffect, useCallback } from "react"
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
