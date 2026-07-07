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
