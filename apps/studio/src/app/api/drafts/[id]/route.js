import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@archron/database";
import { findObjectById, updateObject, softDeleteObject } from "@archron/database";
const EDITABLE_FIELDS = [
    "title",
    "description",
    "aliases",
    "domains",
    "tags",
    "thumbnail",
    "readingTime",
    "wordCount",
    "difficulty",
    "language",
];
function sanitizeUpdateBody(body) {
    const sanitized = {};
    for (const key of EDITABLE_FIELDS) {
        if (key in body) {
            sanitized[key] = body[key];
        }
    }
    return sanitized;
}
export async function GET(_request, { params }) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const obj = await findObjectById(db, id);
    if (!obj)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (obj.authorId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(obj);
}
export async function PUT(request, { params }) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const obj = await findObjectById(db, id);
    if (!obj)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (obj.authorId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    let body;
    try {
        body = await request.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const sanitized = sanitizeUpdateBody(body);
    const result = await updateObject(db, id, sanitized);
    if (!result)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
}
export async function DELETE(_request, { params }) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const obj = await findObjectById(db, id);
    if (!obj)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (obj.authorId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await softDeleteObject(db, id);
    return NextResponse.json({ deleted: true });
}
