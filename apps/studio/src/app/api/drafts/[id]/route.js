import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@archron/database";
import { findObjectById, updateObject, softDeleteObject } from "@archron/database";
export async function GET(_request, { params }) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const obj = await findObjectById(db, id);
    if (!obj)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(obj);
}
export async function PUT(request, { params }) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const result = await updateObject(db, id, body);
    if (!result)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
}
export async function DELETE(_request, { params }) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await softDeleteObject(db, id);
    return NextResponse.json({ deleted: true });
}
