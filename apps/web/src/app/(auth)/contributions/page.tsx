"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  Badge,
  Select,
  Divider,
  Pagination,
  KnowledgeArticleIcon,
  KnowledgeConceptIcon,
  KnowledgeThinkerIcon,
  KnowledgeBookIcon,
  KnowledgeSymbolIcon,
  KnowledgeCollectionIcon,
  FileIcon,
  CheckIcon,
} from "@archron/ui"

interface Contribution {
  id: string
  title: string
  type: string
  date: string
  status: "published" | "draft" | "review" | "archived"
}

const ALL_TYPES = [
  "Articles",
  "Concepts",
  "Thinkers",
  "Books",
  "Symbols",
  "References",
  "Reviews",
  "Collections",
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  Articles: KnowledgeArticleIcon,
  Concepts: KnowledgeConceptIcon,
  Thinkers: KnowledgeThinkerIcon,
  Books: KnowledgeBookIcon,
  Symbols: KnowledgeSymbolIcon,
  Collections: KnowledgeCollectionIcon,
  References: FileIcon,
  Reviews: CheckIcon,
}

const MOCK_CONTRIBUTIONS: Record<string, Contribution[]> = {
  Articles: [
    { id: "1", title: "The Structure of the Unconscious", type: "Articles", date: "2026-07-01", status: "published" },
    { id: "2", title: "Archetypes and the Collective", type: "Articles", date: "2026-06-15", status: "published" },
    { id: "3", title: "Dream Analysis Methods", type: "Articles", date: "2026-06-01", status: "draft" },
    { id: "4", title: "Modern Applications of Analytical Psychology", type: "Articles", date: "2026-05-20", status: "review" },
  ],
  Concepts: [
    { id: "5", title: "Individuation", type: "Concepts", date: "2026-04-10", status: "published" },
    { id: "6", title: "Synchronicity", type: "Concepts", date: "2026-03-22", status: "published" },
  ],
  Thinkers: [
    { id: "7", title: "Carl Gustav Jung", type: "Thinkers", date: "2026-02-14", status: "published" },
    { id: "8", title: "Marie-Louise von Franz", type: "Thinkers", date: "2026-01-05", status: "draft" },
  ],
  Books: [
    { id: "9", title: "Man and His Symbols", type: "Books", date: "2026-02-28", status: "published" },
  ],
  Symbols: [
    { id: "10", title: "The Mandala", type: "Symbols", date: "2026-05-12", status: "published" },
  ],
  References: [
    { id: "11", title: "Jung, C.G. (1959). The Archetypes and the Collective Unconscious", type: "References", date: "2026-04-18", status: "published" },
  ],
  Reviews: [
    { id: "12", title: "Review: Introduction to Shadow Work", type: "Reviews", date: "2026-06-20", status: "published" },
    { id: "13", title: "Review: The Ego in Modern Psychology", type: "Reviews", date: "2026-06-10", status: "review" },
    { id: "14", title: "Review: Jung and Nietzsche", type: "Reviews", date: "2026-05-25", status: "published" },
  ],
  Collections: [
    { id: "15", title: "Jungian Essentials", type: "Collections", date: "2026-06-05", status: "published" },
  ],
}

const ITEMS_PER_PAGE = 10

function statusVariant(status: Contribution["status"]): "default" | "success" | "warning" | "secondary" {
  switch (status) {
    case "published": return "success"
    case "draft": return "secondary"
    case "review": return "warning"
    case "archived": return "default"
  }
}

export default function ContributionsPage() {
  const [filter, setFilter] = useState("All")
  const [page, setPage] = useState(1)

  const grouped = useMemo(() => {
    const result = ALL_TYPES
      .filter((type) => filter === "All" || type === filter)
      .map((type) => ({
        type,
        items: MOCK_CONTRIBUTIONS[type] ?? [],
      }))
      .filter((g) => g.items.length > 0)
    return result
  }, [filter])

  const allItems = useMemo(
    () => grouped.flatMap((g) => g.items),
    [grouped]
  )

  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE))

  const filterOptions = [
    { value: "All", label: "All Types" },
    ...ALL_TYPES.map((t) => ({ value: t, label: t })),
  ]

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24">
        <section className="pt-24">
          <h1 className="font-display text-display font-bold tracking-tight text-text">
            Contributions
          </h1>
          <p className="mt-2 text-body text-text-muted">
            Your knowledge contributions across the ecosystem
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Select
              options={filterOptions}
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1) }}
              className="w-full sm:w-48"
            />
            <span className="text-caption text-text-muted">
              {allItems.length} total contributions
            </span>
          </div>

          <div className="space-y-8">
            {grouped.map((group) => {
              const Icon = TYPE_ICONS[group.type]
              return (
                <div key={group.type}>
                  <div className="mb-3 flex items-center gap-2.5">
                    {Icon && <Icon size="sm" className="text-text-muted" />}
                    <h2 className="font-serif text-card-title font-semibold text-text">
                      {group.type}
                    </h2>
                    <Badge variant="secondary">{group.items.length}</Badge>
                  </div>
                  <Divider className="mb-3" />
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <Card key={item.id} className="transition-colors duration-[var(--motion-normal)] hover:border-primary/30">
                        <CardContent className="flex items-center justify-between py-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-body font-medium text-text">
                              {item.title}
                            </p>
                            <p className="text-caption text-text-disabled">
                              {item.date}
                            </p>
                          </div>
                          <Badge variant={statusVariant(item.status)} className="ml-3 shrink-0 capitalize">
                            {item.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}

            {grouped.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-body text-text-muted">No contributions yet</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
