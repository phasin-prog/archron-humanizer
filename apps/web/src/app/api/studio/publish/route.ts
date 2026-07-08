import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@archron/database"
import { findObjectById, updateObject } from "@archron/database"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: { id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const obj = await findObjectById(db, body.id)
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (obj.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const result = await updateObject(db, body.id, { status: "review" })
  if (!result) return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  return NextResponse.json(result)
}
