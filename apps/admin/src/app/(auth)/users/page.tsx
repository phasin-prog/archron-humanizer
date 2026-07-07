import { Card, CardContent, Badge, Input, Select } from "@archron/ui"
import Link from "next/link"
import type { Role } from "@archron/shared"

interface UserRow {
  id: string
  avatar: string
  name: string
  email: string
  role: Role
  status: "active" | "suspended"
  joined: string
}

const USERS: UserRow[] = [
  { id: "user_1", avatar: "DV", name: "Dr. Helena Voss", email: "helena.voss@archron.com", role: "editor", status: "active", joined: "2025-03-12" },
  { id: "user_2", avatar: "MC", name: "Prof. Marcus Chen", email: "marcus.chen@archron.com", role: "reviewer", status: "active", joined: "2025-04-05" },
  { id: "user_3", avatar: "MS", name: "Maria Silva", email: "maria.silva@archron.com", role: "reviewer", status: "active", joined: "2025-05-18" },
  { id: "user_4", avatar: "JK", name: "James Kim", email: "james.kim@archron.com", role: "writer", status: "active", joined: "2025-06-01" },
  { id: "user_5", avatar: "AR", name: "Alex Reed", email: "alex.reed@archron.com", role: "writer", status: "active", joined: "2025-07-14" },
  { id: "user_6", avatar: "EP", name: "Emily Park", email: "emily.park@archron.com", role: "writer", status: "active", joined: "2025-08-22" },
  { id: "user_7", avatar: "SN", name: "Sarah Nguyen", email: "sarah.nguyen@archron.com", role: "member", status: "active", joined: "2025-09-10" },
  { id: "user_8", avatar: "RW", name: "Robert Weiss", email: "robert.weiss@archron.com", role: "member", status: "suspended", joined: "2025-10-05" },
]

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "administrator", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "reviewer", label: "Reviewer" },
  { value: "writer", label: "Writer" },
  { value: "member", label: "Member" },
]

function statusVariant(status: "active" | "suspended"): "default" | "destructive" {
  return status === "active" ? "default" : "destructive"
}

function roleVariant(role: Role): "default" | "secondary" | "outline" {
  if (role === "editor" || role === "administrator") return "default"
  if (role === "reviewer") return "secondary"
  return "outline"
}

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-page-title font-serif font-bold">Users</h2>
      </div>

      <div className="flex items-center gap-3">
        <Input placeholder="Search by name or email..." className="max-w-xs" />
        <Select
          options={ROLE_OPTIONS}
          placeholder="All Roles"
          className="w-40"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-caption text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-caption font-medium">
                          {user.avatar}
                        </div>
                        <span className="text-caption font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caption text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleVariant(user.role)} className="text-xs capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(user.status)} className="text-xs capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-caption text-muted-foreground">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-caption text-primary hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-caption text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        {user.status === "active" ? (
                          <button className="text-caption text-destructive hover:underline">
                            Suspend
                          </button>
                        ) : (
                          <button className="text-caption text-primary hover:underline">
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
