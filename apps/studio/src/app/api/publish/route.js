import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@archron/database";
import { findObjectById, updateObject } from "@archron/database";
export async function POST(request) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const obj = await findObjectById(db, id);
    if (!obj)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    const result = await updateObject(db, id, { status: "review" });
    if (!result)
        return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    return NextResponse.json(result);
}
