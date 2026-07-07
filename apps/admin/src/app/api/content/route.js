import { NextResponse } from "next/server";
import { getAuth } from "@archron/auth";
import { RoleHierarchy } from "@archron/shared";
import { db, updateObject, softDeleteObject } from "@archron/database";
export async function PUT(request) {
    const { userId, role: userRole } = await getAuth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (RoleHierarchy[userRole] < RoleHierarchy.editor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = (await request.json());
    if (!body.id || !body.action) {
        return NextResponse.json({ error: "id and action are required" }, { status: 400 });
    }
    switch (body.action) {
        case "archive": {
            await updateObject(db, body.id, { status: "archived" });
            return NextResponse.json({ archived: true });
        }
        case "delete": {
            await softDeleteObject(db, body.id);
            return NextResponse.json({ deleted: true });
        }
        case "merge": {
            if (!body.targetId) {
                return NextResponse.json({ error: "targetId is required for merge" }, { status: 400 });
            }
            await softDeleteObject(db, body.id);
            return NextResponse.json({ merged: true });
        }
        default:
            return NextResponse.json({ error: "invalid action" }, { status: 400 });
    }
}
