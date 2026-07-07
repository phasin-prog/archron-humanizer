import { NextResponse } from "next/server";
import { getAuth } from "@archron/auth";
import { RoleHierarchy } from "@archron/shared";
import { db, revisions } from "@archron/database";
import { eq, desc, and, gte, lte } from "drizzle-orm";
export async function GET(request) {
    const { userId, role: userRole } = await getAuth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (RoleHierarchy[userRole] < RoleHierarchy.editor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get("actionType");
    const actor = searchParams.get("actor");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    const conditions = [];
    if (actionType) {
        conditions.push(eq(revisions.revisionType, actionType));
    }
    if (actor) {
        conditions.push(eq(revisions.userId, actor));
    }
    if (from) {
        conditions.push(gte(revisions.createdAt, new Date(from)));
    }
    if (to) {
        conditions.push(lte(revisions.createdAt, new Date(to)));
    }
    const rows = await db
        .select({
        id: revisions.id,
        actionType: revisions.revisionType,
        actorId: revisions.userId,
        objectId: revisions.objectId,
        changeSummary: revisions.changeSummary,
        version: revisions.version,
        createdAt: revisions.createdAt,
    })
        .from(revisions)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(revisions.createdAt))
        .limit(limit)
        .offset(offset);
    return NextResponse.json(rows);
}
