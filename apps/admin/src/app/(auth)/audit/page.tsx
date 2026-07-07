"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, Input, Select, Button, Pagination } from "@archron/ui"
import type { SelectOption } from "@archron/ui"

interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  target: string
  details: string
}

const actionOptions: SelectOption[] = [
  { value: "all", label: "All Actions" },
  { value: "user.created", label: "User Created" },
  { value: "user.role_changed", label: "Role Changed" },
  { value: "user.suspended", label: "User Suspended" },
  { value: "content.published", label: "Content Published" },
  { value: "content.archived", label: "Content Archived" },
  { value: "content.deleted", label: "Content Deleted" },
  { value: "moderation.resolved", label: "Flag Resolved" },
  { value: "moderation.dismissed", label: "Flag Dismissed" },
  { value: "config.updated", label: "Config Updated" },
]

const PLACEHOLDER_ENTRIES: AuditEntry[] = [
  { id: "1", timestamp: "2026-07-07T14:30:00Z", actor: "admin@archron.co", action: "user.role_changed", target: "writer@mail.com", details: "Promoted from member to writer" },
  { id: "2", timestamp: "2026-07-07T13:15:00Z", actor: "admin@archron.co", action: "content.archived", target: "intro-to-jung", details: "Archived due to outdated references" },
  { id: "3", timestamp: "2026-07-07T11:45:00Z", actor: "editor@archron.co", action: "moderation.resolved", target: "flag-42", details: "Dismissed flag on 'The Shadow' — content compliant" },
  { id: "4", timestamp: "2026-07-06T16:20:00Z", actor: "admin@archron.co", action: "config.updated", target: "system", details: "Updated max drafts from 5 to 10" },
  { id: "5", timestamp: "2026-07-06T10:00:00Z", actor: "editor@archron.co", action: "content.published", target: "nietzsche", details: "Published thinker article after review" },
  { id: "6", timestamp: "2026-07-05T09:30:00Z", actor: "admin@archron.co", action: "user.suspended", target: "spammer@mail.com", details: "Suspended for repeated policy violations" },
  { id: "7", timestamp: "2026-07-05T08:00:00Z", actor: "editor@archron.co", action: "content.deleted", target: "draft-legacy", details: "Deleted abandoned draft from 2024" },
  { id: "8", timestamp: "2026-07-04T14:00:00Z", actor: "admin@archron.co", action: "user.created", target: "new-reviewer@mail.com", details: "Account created with reviewer role" },
  { id: "9", timestamp: "2026-07-04T11:30:00Z", actor: "editor@archron.co", action: "moderation.dismissed", target: "flag-38", details: "Flag deemed non-actionable" },
  { id: "10", timestamp: "2026-07-03T15:45:00Z", actor: "admin@archron.co", action: "config.updated", target: "system", details: "Enabled maintenance mode for deployment" },
  { id: "11", timestamp: "2026-07-03T12:00:00Z", actor: "editor@archron.co", action: "user.role_changed", target: "member@mail.com", details: "Promoted from member to writer" },
  { id: "12", timestamp: "2026-07-02T10:00:00Z", actor: "admin@archron.co", action: "content.archived", target: "old-guide", details: "Auto-archived after 90 days inactivity" },
  { id: "13", timestamp: "2026-07-02T08:30:00Z", actor: "editor@archron.co", action: "content.published", target: "active-imagination", details: "Published concept after review approval" },
  { id: "14", timestamp: "2026-07-01T16:00:00Z", actor: "admin@archron.co", action: "moderation.resolved", target: "flag-35", details: "Content hidden, warning issued to writer" },
  { id: "15", timestamp: "2026-07-01T09:00:00Z", actor: "editor@archron.co", action: "user.role_changed", target: "writer@mail.com", details: "Demoted from reviewer to writer" },
]

const ITEMS_PER_PAGE = 10

const actionColors: Record<string, string> = {
  "user.created": "bg-green-100 text-green-800",
  "user.role_changed": "bg-blue-100 text-blue-800",
  "user.suspended": "bg-red-100 text-red-800",
  "content.published": "bg-green-100 text-green-800",
  "content.archived": "bg-yellow-100 text-yellow-800",
  "content.deleted": "bg-red-100 text-red-800",
  "moderation.resolved": "bg-green-100 text-green-800",
  "moderation.dismissed": "bg-gray-100 text-gray-800",
  "config.updated": "bg-purple-100 text-purple-800",
}

function formatAction(action: string) {
  return action
    .replace(/\./g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function exportCSV(entries: AuditEntry[]) {
  const header = "Timestamp,Actor,Action,Target,Details\n"
  const rows = entries
    .map((e) => `"${e.timestamp}","${e.actor}","${e.action}","${e.target}","${e.details.replace(/"/g, '""')}"`)
    .join("\n")
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AuditPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [actorFilter, setActorFilter] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return PLACEHOLDER_ENTRIES.filter((entry) => {
      if (startDate && entry.timestamp < startDate) return false
      if (endDate && entry.timestamp > endDate + "T23:59:59Z") return false
      if (actionFilter !== "all" && entry.action !== actionFilter) return false
      if (actorFilter && !entry.actor.toLowerCase().includes(actorFilter.toLowerCase())) return false
      return true
    })
  }, [startDate, endDate, actionFilter, actorFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleFilterChange = () => {
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title font-serif font-bold">Audit Trail</h1>
          <p className="text-muted-foreground text-body">System-wide activity and change log</p>
        </div>
        <Button variant="outline" onClick={() => exportCSV(filtered)}>
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-44">
              <label className="mb-1 block text-xs text-muted-foreground">From</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); handleFilterChange() }}
              />
            </div>
            <div className="w-44">
              <label className="mb-1 block text-xs text-muted-foreground">To</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); handleFilterChange() }}
              />
            </div>
            <div className="w-48">
              <label className="mb-1 block text-xs text-muted-foreground">Action Type</label>
              <Select
                options={actionOptions}
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); handleFilterChange() }}
              />
            </div>
            <div className="w-56">
              <label className="mb-1 block text-xs text-muted-foreground">Actor</label>
              <Input
                placeholder="Search by email..."
                value={actorFilter}
                onChange={(e) => { setActorFilter(e.target.value); handleFilterChange() }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Target</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{formatDate(entry.timestamp)}</td>
                    <td className="px-4 py-3 text-sm">{entry.actor}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${actionColors[entry.action] ?? "bg-gray-100 text-gray-800"}`}>
                        {formatAction(entry.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.target}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">{entry.details}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No audit entries match the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {paginated.length} of {filtered.length} entries
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
