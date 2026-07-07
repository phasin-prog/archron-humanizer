import { auth as clerkAuth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server"
import type { Role } from "@archron/shared"
import { RoleHierarchy } from "@archron/shared"

export async function getAuth() {
  const session = await clerkAuth()
  const user = await clerkCurrentUser()

  if (!session.userId || !user) {
    return { userId: null, role: "guest" as Role, user: null }
  }

  const role = (user.publicMetadata?.role as Role) ?? "member"

  return {
    userId: session.userId,
    role,
    user,
  }
}

export async function requireRole(minimumRole: Role) {
  const { role, userId, user } = await getAuth()
  const minLevel = RoleHierarchy[minimumRole]
  const userLevel = RoleHierarchy[role]

  if (!userId) {
    throw new Error("Authentication required")
  }

  if (userLevel < minLevel) {
    throw new Error(`Requires at least ${minimumRole} role`)
  }

  return { userId, role, user }
}

export { clerkClient } from "@clerk/nextjs/server"
