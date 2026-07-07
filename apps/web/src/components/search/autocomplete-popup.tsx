"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ConceptIcon,
  ThinkerIcon,
  BookIcon,
  ArticleIcon,
  ArrowRightIcon,
} from "@archron/ui"

type ObjectType = "concept" | "thinker" | "book" | "article"

interface AutocompleteItem {
  slug: string
  title: string
  description: string
  type: ObjectType
  meta?: string
}

interface AutocompleteGroup {
  type: ObjectType
  label: string
  items: AutocompleteItem[]
}

interface AutocompleteResponse {
  groups: AutocompleteGroup[]
}

interface AutocompletePopupProps {
  query: string
  open: boolean
  onClose: () => void
}

const TYPE_ICONS: Record<ObjectType, React.ComponentType<{ size?: "sm" | "md" | "lg" | "xl"; className?: string }>> = {
  concept: ConceptIcon,
  thinker: ThinkerIcon,
  book: BookIcon,
  article: ArticleIcon,
}

function flattenItems(groups: AutocompleteGroup[]): (AutocompleteItem & { groupType: ObjectType })[] {
  return groups.flatMap((g) => g.items.map((item) => ({ ...item, groupType: g.type })))
}

export function AutocompletePopup({ query, open, onClose }: AutocompletePopupProps) {
  const [results, setResults] = useState<AutocompleteGroup[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || query.length < 2) {
      setResults([])
      setActiveIndex(-1)
      return
    }

    let cancelled = false
    setLoading(true)

    const controller = new AbortController()

    fetch(`/search/autocomplete?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: AutocompleteResponse) => {
        if (!cancelled) {
          setResults(data.groups)
          setActiveIndex(-1)
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [query, open])

  const allItems = flattenItems(results)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0))
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1))
          break
        case "Tab":
          e.preventDefault()
          if (e.shiftKey) {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1))
          } else {
            setActiveIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0))
          }
          break
        case "Enter":
          if (allItems[activeIndex]) {
            e.preventDefault()
            const item = allItems[activeIndex]!
            window.location.href = `/${item.slug}`
          } else if (query.length > 0) {
            e.preventDefault()
            window.location.href = `/search?q=${encodeURIComponent(query)}`
          }
          break
        case "Escape":
          onClose()
          break
      }
    },
    [activeIndex, allItems, query, onClose]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null
  if (query.length < 2) return null

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-[var(--z-dropdown)] mt-1 w-full rounded-xl border border-border bg-card shadow-lg"
      onKeyDown={handleKeyDown}
    >
      {loading && results.length === 0 ? (
        <div className="px-4 py-3 text-caption text-text-disabled">Searching...</div>
      ) : results.length === 0 ? (
        <div className="px-4 py-3 text-caption text-text-disabled">No results found.</div>
      ) : (
        <div className="py-2">
          {results.map((group) => (
            <div key={group.type}>
              <div className="px-4 py-1.5 font-mono text-meta font-medium uppercase text-text-disabled">
                {group.label}
              </div>
              {group.items.map((item) => {
                const flatIdx = allItems.findIndex((i) => i.slug === item.slug && i.groupType === group.type)
                const isActive = flatIdx === activeIndex
                const Icon = TYPE_ICONS[item.type]
                return (
                  <Link
                    key={`${group.type}-${item.slug}`}
                    href={`/${item.slug}`}
                    onClick={onClose}
                    className={`flex items-start gap-3 px-4 py-2 transition-colors ${
                      isActive
                        ? "bg-primary/10 text-text"
                        : "text-text hover:bg-elevated"
                    }`}
                  >
                    <Icon size="sm" className="mt-0.5 shrink-0 text-text-disabled" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-serif text-caption font-medium text-text">
                          {item.title}
                        </span>
                        {item.meta && (
                          <span className="shrink-0 text-meta text-text-disabled">{item.meta}</span>
                        )}
                      </div>
                      <p className="line-clamp-1 text-meta text-text-muted">{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}

          <div className="border-t border-border mt-1 pt-1">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className={`flex items-center gap-2 px-4 py-2 text-caption text-text-muted transition-colors hover:bg-elevated hover:text-text ${
                activeIndex === allItems.length ? "bg-primary/10 text-text" : ""
              }`}
              onMouseEnter={() => setActiveIndex(allItems.length)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              See all results for &quot;{query}&quot;
              <ArrowRightIcon size="sm" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
