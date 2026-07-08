"use client"

import { useState } from "react"
import { Input, Select, Badge, Card, CardHeader, CardTitle, CardContent } from "@archron/ui"
import type { SelectOption } from "@archron/ui"

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "Review" },
  { value: "published", label: "Published" },
]

const placeholderDrafts = [
  { id: "1", title: "The Archetype of the Shadow", status: "draft", updatedAt: "2026-07-06" },
  { id: "2", title: "Nietzsche and the Will to Power", status: "review", updatedAt: "2026-07-05" },
  { id: "3", title: "Collective Unconscious in Modern Psychology", status: "draft", updatedAt: "2026-07-04" },
  { id: "4", title: "Sartre's Concept of Bad Faith", status: "published", updatedAt: "2026-07-03" },
  { id: "5", title: "Synchronicity and Meaning", status: "review", updatedAt: "2026-07-02" },
]

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "info" | "destructive" | "outline"> = {
  draft: "secondary",
  review: "warning",
  published: "success",
}

export function DraftsTab() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = placeholderDrafts.filter((d) => {
    if (filter !== "all" && d.status !== filter) return false
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      <form role="search" className="flex gap-4">
        <Input
          placeholder="Search drafts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
          aria-label="Search drafts"
        />
        <Select
          options={statusOptions}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-[180px]"
          aria-label="Filter by status"
        />
      </form>
      <div className="space-y-2">
        {filtered.map((draft) => (
          <Card key={draft.id} className="cursor-pointer transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" tabIndex={0} role="button">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{draft.title}</CardTitle>
              <Badge variant={statusVariant[draft.status] ?? "default"}>
                {draft.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Updated {draft.updatedAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
