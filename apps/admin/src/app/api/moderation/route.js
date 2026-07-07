import { NextResponse } from "next/server";
import { getAuth } from "@archron/auth";
import { RoleHierarchy } from "@archron/shared";
import { db, notifications } from "@archron/database";
import { eq, desc, and } from "drizzle-orm";
export async function GET(request) {
    const { userId, role: userRole } = await getAuth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (RoleHierarchy[userRole] < RoleHierarchy.editor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    const conditions = [eq(notifications.type, "content_flagged")];
    if (status === "resolved") {
        conditions.push(eq(notifications.isRead, true));
    }
    else if (status === "pending" || !status) {
        conditions.push(eq(notifications.isRead, false));
    }
    const rows = await db
        .select({
        id: notifications.id,
        type: notifications.type,
        title: notifications.title,
        body: notifications.body,
        isRead: notifications.isRead,
        actorId: notifications.actorId,
        objectId: notifications.objectId,
        metadata: notifications.metadata,
        createdAt: notifications.createdAt,
    })
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);
    return NextResponse.json(rows);
}
export async function POST(request) {
    const { userId, role: userRole } = await getAuth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (RoleHierarchy[userRole] < RoleHierarchy.editor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = (await request.json());
    if (!body.flagId || !body.action) {
        return NextResponse.json({ error: "flagId and action are required" }, { status: 400 });
    }
    if (body.action === "resolve") {
        await db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, body.flagId));
    }
    else if (body.action === "dismiss") {
        await db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, body.flagId));
    }
    else {
        return NextResponse.json({ error: "action must be resolve or dismiss" }, { status: 400 });
    }
    return NextResponse.json({ resolved: true });
}
