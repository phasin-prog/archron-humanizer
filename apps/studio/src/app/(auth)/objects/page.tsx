"use client"

import { useState } from "react"
import { Input, Select, KnowledgeCard } from "@archron/ui"
import type { SelectOption, KnowledgeCardProps } from "@archron/ui"

const typeOptions: SelectOption[] = [
  { value: "all", label: "All Types" },
  { value: "concept", label: "Concept" },
  { value: "thinker", label: "Thinker" },
  { value: "book", label: "Book" },
  { value: "article", label: "Article" },
  { value: "school", label: "School" },
  { value: "theory", label: "Theory" },
]

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

const placeholderObjects: KnowledgeCardProps[] = [
  { slug: "shadow", title: "The Shadow", objectType: "concept", description: "The unconscious aspect of personality that the conscious ego does not identify with.", backlinkCount: 24, viewCount: 1500 },
  { slug: "nietzsche", title: "Friedrich Nietzsche", objectType: "thinker", description: "German philosopher known for his critiques of traditional morality and religion.", backlinkCount: 42, viewCount: 3200 },
  { slug: "collective-unconscious", title: "Collective Unconscious", objectType: "concept", description: "Jung's theory of a shared unconscious mind common to all human beings.", backlinkCount: 18, viewCount: 2100 },
  { slug: "man-and-his-symbols", title: "Man and His Symbols", objectType: "book", description: "Jung's final work introducing his theories to a general audience.", backlinkCount: 15, viewCount: 980 },
  { slug: "existentialism", title: "Existentialism", objectType: "school", description: "A philosophical movement focused on individual existence, freedom, and choice.", backlinkCount: 35, viewCount: 2800 },
  { slug: "anima-animus", title: "Anima and Animus", objectType: "concept", description: "The unconscious feminine and masculine aspects within each individual.", backlinkCount: 12, viewCount: 890 },
]

export default function ObjectsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = placeholderObjects.filter((obj) => {
    if (search && !obj.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== "all" && obj.objectType !== typeFilter) return false
    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Knowledge Manager</h1>
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search objects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="max-w-[180px]"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-[180px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((obj) => (
          <KnowledgeCard key={obj.slug} {...obj} />
        ))}
      </div>
    </div>
  )
}
