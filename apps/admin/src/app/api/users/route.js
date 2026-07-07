import { NextResponse } from "next/server";
import { getAuth } from "@archron/auth";
import { RoleHierarchy } from "@archron/shared";
import { db, users, profiles } from "@archron/database";
import { eq, like, or, and, isNull, desc } from "drizzle-orm";
export async function GET(request) {
    const { userId, role: userRole } = await getAuth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (RoleHierarchy[userRole] < RoleHierarchy.editor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const roleFilter = searchParams.get("role");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    const conditions = [isNull(users.deletedAt)];
    if (search) {
        conditions.push(or(like(users.email, `%${search}%`), like(profiles.displayName, `%${search}%`)));
    }
    if (roleFilter) {
        conditions.push(eq(users.role, roleFilter));
    }
    const rows = await db
        .select({
        id: users.id,
        email: users.email,
        role: users.role,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        reputation: profiles.reputation,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
    })
        .from(users)
        .leftJoin(profiles, eq(users.id, profiles.userId))
        .where(and(...conditions))
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);
    return NextResponse.json(rows);
}
