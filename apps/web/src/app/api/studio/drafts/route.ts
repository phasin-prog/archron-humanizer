import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@archron/database"
import { listObjects, createObject } from "@archron/database"
import type { CreateObjectData } from "@archron/database"
import type { ObjectQuery } from "@archron/shared"

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const query: ObjectQuery = {
    status: ["draft"],
    limit: Number(searchParams.get("limit")) || 20,
    offset: Number(searchParams.get("offset")) || 0,
  }

  const results = await listObjects(db, query)
  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await request.json()) as CreateObjectData
  const result = await createObject(db, { ...body, authorId: userId })
  return NextResponse.json(result, { status: 201 })
}
