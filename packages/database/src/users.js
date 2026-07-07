import { eq } from "drizzle-orm";
import { users, profiles } from "./schema/core";
export async function findUserByClerkId(db, clerkId) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);
    return user ?? null;
}
export async function findUserById(db, id) {
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
        .limit(1);
    return row ?? null;
}
export async function createUser(db, data) {
    const [user] = await db
        .insert(users)
        .values({
        clerkId: data.clerkId,
        email: data.email,
        role: data.role ?? "member",
    })
        .returning();
    if (!user)
        throw new Error("Failed to create user");
    return user;
}
export async function findOrCreateUser(db, clerkId, email) {
    const [inserted] = await db
        .insert(users)
        .values({ clerkId, email, role: "member" })
        .onConflictDoNothing()
        .returning();
    if (inserted)
        return inserted;
    const existing = await findUserByClerkId(db, clerkId);
    if (!existing)
        throw new Error("Failed to find or create user");
    return existing;
}
export async function updateProfile(db, userId, data) {
    const [existing] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .limit(1);
    if (existing) {
        const [updated] = await db
            .update(profiles)
            .set(data)
            .where(eq(profiles.userId, userId))
            .returning();
        return updated;
    }
    const [created] = await db
        .insert(profiles)
        .values({
        userId,
        displayName: data.displayName ?? "Member",
        bio: data.bio,
        avatarUrl: data.avatarUrl,
    })
        .returning();
    return created;
}
export async function updateRole(db, userId, role) {
    await db.update(users).set({ role }).where(eq(users.id, userId));
}
