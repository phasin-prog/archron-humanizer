"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, Badge, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@archron/ui"

interface ContentItem {
  id: string
  title: string
  slug: string
  type: string
  author: string
  date: string
  status: "published" | "archived" | "flagged"
}

const CONTENT: ContentItem[] = [
  { id: "obj_001", title: "The Shadow in Jungian Psychology", slug: "shadow-jungian", type: "concept", author: "Dr. Marcus Chen", date: "2026-06-15", status: "published" },
  { id: "obj_002", title: "Nietzsche and the Death of God", slug: "nietzsche-death-god", type: "article", author: "Sarah Klein", date: "2026-06-20", status: "published" },
  { id: "obj_003", title: "Collective Unconscious: A Guide", slug: "collective-unconscious", type: "guide", author: "Prof. James Hart", date: "2026-05-10", status: "published" },
  { id: "obj_004", title: "Freud's Interpretation of Dreams", slug: "freud-interpretation-dreams", type: "book", author: "Prof. David Kim", date: "2026-04-22", status: "published" },
  { id: "obj_005", title: "Existentialism and Authenticity", slug: "existentialism-authenticity", type: "theory", author: "Dr. Rachel Torres", date: "2026-06-01", status: "published" },
  { id: "obj_006", title: "Behaviorism: A Critical Analysis", slug: "behaviorism-analysis", type: "article", author: "Emily Ross", date: "2026-03-15", status: "archived" },
  { id: "obj_007", title: "Structuralism in Literary Theory", slug: "structuralism-literary", type: "theory", author: "Prof. Anna Schmidt", date: "2026-02-08", status: "archived" },
  { id: "obj_008", title: "The Ego and the Id: A Primer", slug: "ego-id-primer", type: "article", author: "Dr. James Hart", date: "2026-07-01", status: "flagged" },
  { id: "obj_009", title: "Phenomenology of Perception", slug: "phenomenology-perception", type: "book", author: "Sarah Klein", date: "2026-06-28", status: "flagged" },
  { id: "obj_010", title: "Archetypes in Modern Media", slug: "archetypes-modern-media", type: "article", author: "David Kim", date: "2026-06-25", status: "flagged" },
]

const STATUS_VARIANT: Record<string, "success" | "secondary" | "warning"> = {
  published: "success",
  archived: "secondary",
  flagged: "warning",
}

const HEADERS = ["Title", "Type", "Author", "Date", "Status", "Actions"] as const

function DeleteDialog({ item, onDelete }: { item: ContentItem; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Content</DialogTitle>
          <DialogDescription>
            This will permanently delete &ldquo;{item.title}&rdquo;. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => { onDelete(item.id); setOpen(false) }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ContentTable({ items, onArchive, onDelete }: { items: ContentItem[]; onArchive: (id: string) => void; onDelete: (id: string) => void }) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-caption text-muted-foreground">No content found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body">
        <thead>
          <tr className="border-b bg-muted/20">
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-caption font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/20">
              <td className="px-4 py-3 max-w-48 truncate">
                <Link href={`/objects/${item.slug}`} className="hover:text-primary transition-colors">{item.title}</Link>
                <p className="text-caption text-muted-foreground">/{item.slug}</p>
              </td>
              <td className="px-4 py-3 text-caption capitalize">{item.type}</td>
              <td className="px-4 py-3 text-caption">{item.author}</td>
              <td className="px-4 py-3 text-caption">{item.date}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[item.status]} className="text-caption">{item.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Link href={`/objects/${item.slug}`}><Button variant="ghost" size="sm">View</Button></Link>
                  {item.status === "published" && (
                    <Button variant="ghost" size="sm" onClick={() => onArchive(item.id)}>Archive</Button>
                  )}
                  <DeleteDialog item={item} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>(CONTENT)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [, setTab] = useState("published")

  const published = items.filter((i) => i.status === "published")
  const archived = items.filter((i) => i.status === "archived")
  const flagged = items.filter((i) => i.status === "flagged")

  const filterBySearch = (list: ContentItem[]) =>
    search ? list.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.slug.toLowerCase().includes(search.toLowerCase())) : list

  const toggleAll = useCallback((list: ContentItem[]) => {
    setSelectedIds((prev) => {
      const allSelected = list.every((i) => prev.has(i.id))
      if (allSelected) {
        const next = new Set(prev)
        list.forEach((i) => next.delete(i.id))
        return next
      }
      const next = new Set(prev)
      list.forEach((i) => { if (!next.has(i.id)) next.add(i.id) })
      return next
    })
  }, [])

  const archiveSelected = useCallback(() => {
    setItems((prev) =>
      prev.map((i) => (selectedIds.has(i.id) && i.status === "published" ? { ...i, status: "archived" as const } : i))
    )
    setSelectedIds(new Set())
  }, [selectedIds])

  const deleteSelected = useCallback(() => {
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)))
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleArchive = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id && i.status === "published" ? { ...i, status: "archived" as const } : i)))
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next })
  }, [])

  const renderTab = (list: ContentItem[], tabValue: string) => {
    const filtered = filterBySearch(list)
    const allSelected = filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id))

    return (
      <TabsContent value={tabValue}>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex-1" />
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-caption">
                <span className="text-muted-foreground">{selectedIds.size} selected</span>
                <Button variant="outline" size="sm" onClick={archiveSelected}>Archive</Button>
                <Button variant="destructive" size="sm" onClick={deleteSelected}>Delete</Button>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="flex items-center gap-3 border-b px-4 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => toggleAll(filtered)}
                  className="h-4 w-4"
                />
                <span className="text-caption text-muted-foreground">{filtered.length} items</span>
              </div>
              <ContentTable items={filtered} onArchive={handleArchive} onDelete={handleDelete} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title font-serif font-bold">Content Management</h1>
          <p className="text-caption text-muted-foreground mt-1">
            {items.filter((i) => i.status === "published").length} published &bull; {items.filter((i) => i.status === "archived").length} archived &bull; {items.filter((i) => i.status === "flagged").length} flagged
          </p>
        </div>
      </div>

      <Tabs defaultValue="published" onValueChange={useCallback((v: string) => setTab(v), [])}>
        <TabsList>
          <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({flagged.length})</TabsTrigger>
        </TabsList>

        {renderTab(published, "published")}
        {renderTab(archived, "archived")}
        {renderTab(flagged, "flagged")}
      </Tabs>
    </div>
  )
}
