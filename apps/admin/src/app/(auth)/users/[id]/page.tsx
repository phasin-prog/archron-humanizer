"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardTitle, Badge, Select, Button } from "@archron/ui"
import { useParams } from "next/navigation"

interface UserProfile {
  id: string
  avatar: string
  name: string
  email: string
  role: string
  joined: string
  status: "active" | "suspended"
  reputation: number
}

interface ActivityEntry {
  id: string
  action: string
  detail: string
  timestamp: string
}

interface AuditEntry {
  id: string
  date: string
  actor: string
  action: string
  detail: string
}

const PROFILE: UserProfile = {
  id: "user_2",
  avatar: "MC",
  name: "Prof. Marcus Chen",
  email: "marcus.chen@archron.com",
  role: "reviewer",
  joined: "2025-04-05",
  status: "active",
  reputation: 2340,
}

const ACTIVITIES: ActivityEntry[] = [
  { id: "a1", action: "Draft created", detail: "\"The Shadow in Modern Cinema\"", timestamp: "2 hours ago" },
  { id: "a2", action: "Review completed", detail: "Reviewed \"Freud's Legacy\" by Dr. Helena Voss", timestamp: "5 hours ago" },
  { id: "a3", action: "Comment", detail: "Commented on \"Archetypes in Literature\"", timestamp: "Yesterday" },
  { id: "a4", action: "Draft submitted", detail: "Submitted \"Jungian Perspectives\" for review", timestamp: "2 days ago" },
  { id: "a5", action: "Review completed", detail: "Reviewed \"The Anima in Literature\"", timestamp: "3 days ago" },
]

const AUDIT_TRAIL: AuditEntry[] = [
  { id: "e1", date: "2025-11-15", actor: "Dr. Helena Voss", action: "Role Change", detail: "Promoted from writer to reviewer" },
  { id: "e2", date: "2025-08-22", actor: "System", action: "Content Flagged", detail: "Article flagged for review" },
  { id: "e3", date: "2025-04-05", actor: "Dr. Helena Voss", action: "Role Change", detail: "Promoted from member to writer" },
]

const ROLE_OPTIONS = [
  { value: "administrator", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "reviewer", label: "Reviewer" },
  { value: "writer", label: "Writer" },
  { value: "member", label: "Member" },
]

function roleVariant(role: string): "default" | "secondary" | "outline" {
  if (role === "editor" || role === "administrator") return "default"
  if (role === "reviewer") return "secondary"
  return "outline"
}

export default function UserDetailPage() {
  const params = useParams()
  const [role, setRole] = useState(PROFILE.role)
  const [status, setStatus] = useState(PROFILE.status)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [pendingRole, setPendingRole] = useState<string | null>(null)

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPendingRole(e.target.value)
    setConfirmVisible(true)
  }

  const confirmRoleChange = () => {
    if (pendingRole) {
      setRole(pendingRole)
    }
    setConfirmVisible(false)
    setPendingRole(null)
  }

  const handleToggleStatus = () => {
    setStatus(status === "active" ? "suspended" : "active")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h2 className="text-page-title font-serif font-bold">
        User Detail — {PROFILE.name} {params.id !== PROFILE.id && `(${params.id})`}
      </h2>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-medium">
              {PROFILE.avatar}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-card-title">{PROFILE.name}</CardTitle>
                <Badge variant={roleVariant(role)} className="text-xs capitalize">
                  {role}
                </Badge>
                <Badge variant={status === "active" ? "default" : "destructive"} className="text-xs capitalize">
                  {status}
                </Badge>
              </div>
              <div className="space-y-1 text-caption text-muted-foreground">
                <p>{PROFILE.email}</p>
                <p>Joined: {PROFILE.joined}</p>
                <p>Reputation: {PROFILE.reputation.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-section-title font-serif font-semibold">Role Management</h3>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <Select
                options={ROLE_OPTIONS}
                value={role}
                onChange={handleRoleChange}
                placeholder="Select role"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleToggleStatus}
            >
              {status === "active" ? "Suspend Account" : "Reactivate Account"}
            </Button>
          </div>

          {confirmVisible && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-caption font-medium">
                Change role to <span className="capitalize">{pendingRole}</span>?
              </p>
              <p className="mt-1 text-caption text-muted-foreground">
                This will update the user&apos;s permissions across the platform.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" onClick={confirmRoleChange}>
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setConfirmVisible(false)
                    setPendingRole(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-section-title font-serif font-semibold">Activity History</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{activity.action}</Badge>
                        <span className="text-caption">{activity.detail}</span>
                      </div>
                      <p className="text-caption text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="mb-3 text-section-title font-serif font-semibold">Audit Trail</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {AUDIT_TRAIL.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                        <span className="text-caption">{entry.detail}</span>
                      </div>
                      <p className="text-caption text-muted-foreground">
                        {entry.date} — by {entry.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
