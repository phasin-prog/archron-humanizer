"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, Badge, Button, Select } from "@archron/ui"
import type { SelectOption } from "@archron/ui"

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Flags" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
]

interface Flag {
  id: string
  contentTitle: string
  contentType: string
  type: string
  reporter: string
  date: string
  status: "pending" | "resolved" | "dismissed"
}

const FLAGS: Flag[] = [
  { id: "flg_001", contentTitle: "The Shadow in Jungian Psychology", contentType: "concept", type: "Inaccurate", reporter: "jessica.wilson@example.com", date: "2026-07-06", status: "pending" },
  { id: "flg_002", contentTitle: "Nietzsche and the Death of God", contentType: "article", type: "Offensive", reporter: "marcus.aurelius@example.com", date: "2026-07-05", status: "pending" },
  { id: "flg_003", contentTitle: "Freud's Interpretation of Dreams", contentType: "book", type: "Copyright", reporter: "sarah.chen@example.com", date: "2026-07-04", status: "resolved" },
  { id: "flg_004", contentTitle: "Behaviorism: A Critical Analysis", contentType: "article", type: "Spam", reporter: "david.kim@example.com", date: "2026-07-03", status: "dismissed" },
  { id: "flg_005", contentTitle: "Existentialism and Authenticity", contentType: "theory", type: "Misleading", reporter: "emma.davis@example.com", date: "2026-07-02", status: "pending" },
  { id: "flg_006", contentTitle: "Collective Unconscious: A Guide", contentType: "guide", type: "Duplicate", reporter: "liam.nguyen@example.com", date: "2026-07-01", status: "pending" },
]

const STATUS_VARIANT: Record<string, "warning" | "success" | "secondary"> = {
  pending: "warning",
  resolved: "success",
  dismissed: "secondary",
}

const HEADERS = ["Flag ID", "Content", "Type", "Reporter", "Date", "Status", "Actions"] as const

export default function ModerationPage() {
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = statusFilter === "all"
    ? FLAGS
    : FLAGS.filter((f) => f.status === statusFilter)

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title font-serif font-bold">Moderation Queue</h1>
          <p className="text-caption text-muted-foreground mt-1">
            {FLAGS.filter((f) => f.status === "pending").length} pending flags
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        />
        <span className="text-caption text-muted-foreground">{filtered.length} flags</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b bg-muted/30">
                  {HEADERS.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-caption font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((flag) => (
                  <tr key={flag.id} className="border-b transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-caption">{flag.id}</td>
                    <td className="px-4 py-3 max-w-60 truncate">{flag.contentTitle}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-caption">{flag.type}</Badge></td>
                    <td className="px-4 py-3 text-caption text-muted-foreground">{flag.reporter}</td>
                    <td className="px-4 py-3 text-caption">{flag.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[flag.status]} className="text-caption">{flag.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/moderation/${flag.id}`}>
                        <Button variant="outline" size="sm">Review</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={HEADERS.length} className="px-4 py-12 text-center text-caption text-muted-foreground">
                      No flags found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
