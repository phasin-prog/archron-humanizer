import { eq } from "drizzle-orm"
import type { DB } from "./db"
import { users, profiles } from "./schema/core"

type UserRole = typeof users.$inferSelect["role"]

export async function findUserByClerkId(
  db: DB,
  clerkId: string,
): Promise<typeof users.$inferSelect | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)
  return user ?? null
}

export async function findUserById(db: DB, id: string) {
  const [row] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      profile: {
        id: profiles.id,
        displayName: profiles.displayName,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        reputation: profiles.reputation,
        level: profiles.level,
      },
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, id))
    .limit(1)

  return row ?? null
}

export async function createUser(
  db: DB,
  data: { clerkId: string; email: string; role?: UserRole },
): Promise<typeof users.$inferSelect> {
  const [user] = await db
    .insert(users)
    .values({
      clerkId: data.clerkId,
      email: data.email,
      role: data.role ?? "member",
    })
    .returning()

  if (!user) throw new Error("Failed to create user")
  return user
}

export async function findOrCreateUser(
  db: DB,
  clerkId: string,
  email: string,
): Promise<typeof users.$inferSelect> {
  const existing = await findUserByClerkId(db, clerkId)
  if (existing) return existing
  return createUser(db, { clerkId, email })
}

export async function updateProfile(
  db: DB,
  userId: string,
  data: {
    displayName?: string
    bio?: string
    avatarUrl?: string
  },
) {
  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)

  if (existing) {
    const [updated] = await db
      .update(profiles)
      .set(data)
      .where(eq(profiles.userId, userId))
      .returning()
    return updated
  }

  const [created] = await db
    .insert(profiles)
    .values({
      userId,
      displayName: data.displayName ?? "Member",
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    })
    .returning()

  return created
}

export async function updateRole(
  db: DB,
  userId: string,
  role: UserRole,
): Promise<void> {
  await db.update(users).set({ role }).where(eq(users.id, userId))
}
