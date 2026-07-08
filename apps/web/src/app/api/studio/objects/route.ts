import { NextResponse } from "next/server"
import { getAuth } from "@archron/auth"
import { db } from "@archron/database"
import { listObjects, createObject } from "@archron/database"
import type { CreateObjectData } from "@archron/database"
import type { ObjectQuery } from "@archron/shared"

export async function GET(request: Request) {
  const { userId } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const typesRaw = searchParams.get("types")
  const statusRaw = searchParams.get("status")
  const query: ObjectQuery = {
    types: typesRaw ? (typesRaw.split(",") as ObjectQuery["types"]) : undefined,
    status: statusRaw ? statusRaw.split(",") : undefined,
    limit: Number(searchParams.get("limit")) || 20,
    offset: Number(searchParams.get("offset")) || 0,
  }

  const results = await listObjects(db, query)
  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const { userId } = await getAuth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await request.json()) as CreateObjectData
  const result = await createObject(db, { ...body, authorId: userId })
  return NextResponse.json(result, { status: 201 })
}
