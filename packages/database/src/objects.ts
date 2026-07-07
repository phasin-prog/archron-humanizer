import { eq, asc, desc, and, isNull, inArray, sql } from "drizzle-orm"
import type { SQL } from "drizzle-orm"
import type { ObjectQuery, ObjectResult } from "@archron/shared"
import type { DB } from "./db"
import { objects } from "./schema/core"
import * as knowledge from "./schema/knowledge"

type DomainTable =
  | typeof knowledge.concepts
  | typeof knowledge.thinkers
  | typeof knowledge.books
  | typeof knowledge.articles
  | typeof knowledge.theories
  | typeof knowledge.schools
  | typeof knowledge.disciplines
  | typeof knowledge.symbols
  | typeof knowledge.quotes
  | typeof knowledge.timelineEvents

const DOMAIN_MAP: Record<string, DomainTable> = {
  concept: knowledge.concepts,
  thinker: knowledge.thinkers,
  book: knowledge.books,
  article: knowledge.articles,
  theory: knowledge.theories,
  school: knowledge.schools,
  discipline: knowledge.disciplines,
  symbol: knowledge.symbols,
  quote: knowledge.quotes,
  timeline_event: knowledge.timelineEvents,
}

function getDomainTable(objectType: string): DomainTable | null {
  return DOMAIN_MAP[objectType] ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapObjectRow(row: any): ObjectResult {
  const result: ObjectResult = {
    id: row.id,
    objectType: row.objectType as ObjectResult["objectType"],
    slug: row.slug,
    title: row.title,
    status: row.status,
    visibility: row.visibility,
    language: row.language,
    difficulty: row.difficulty,
    description: row.description,
    aliases: row.aliases ?? [],
    domains: row.domains ?? [],
    tags: row.tags ?? [],
    thumbnail: row.thumbnail,
    readingTime: row.readingTime,
    wordCount: row.wordCount,
    viewCount: row.viewCount,
    backlinkCount: row.backlinkCount,
    version: row.version,
    authorId: row.authorId,
    editorId: row.editorId,
    publishedAt:
      row.publishedAt?.toISOString?.() ?? row.publishedAt,
    createdAt:
      row.createdAt?.toISOString?.() ?? row.createdAt,
    updatedAt:
      row.updatedAt?.toISOString?.() ?? row.updatedAt,
  }
  return result
}

export async function findObjectById(db: DB, id: string): Promise<ObjectResult | null> {
  const rows = await db.select().from(objects).where(eq(objects.id, id)).limit(1)
  const obj = rows[0]
  if (!obj) return null
  return mapObjectRow(obj)
}

export async function findObjectBySlug(db: DB, slug: string): Promise<ObjectResult | null> {
  const rows = await db
    .select()
    .from(objects)
    .where(and(eq(objects.slug, slug), isNull(objects.deletedAt)))
    .limit(1)
  const obj = rows[0]
  if (!obj) return null
  return mapObjectRow(obj)
}

export async function listObjects(db: DB, query: ObjectQuery = {}): Promise<ObjectResult[]> {
  const conditions: SQL[] = [isNull(objects.deletedAt)]

  if (query.types?.length) {
    conditions.push(inArray(objects.objectType, query.types))
  }
  if (query.status?.length) {
    conditions.push(sql`${objects.status} = ANY(${query.status})`)
  }
  if (query.language) {
    conditions.push(sql`${objects.language} = ${query.language}`)
  }
  if (query.difficulty) {
    conditions.push(sql`${objects.difficulty} = ${query.difficulty}`)
  }
  if (query.domains?.length) {
    conditions.push(sql`${objects.domains} && ${query.domains}::varchar[]`)
  }
  if (query.tags?.length) {
    conditions.push(sql`${objects.tags} && ${query.tags}::varchar[]`)
  }

  let orderBy = desc(objects.createdAt)
  if (query.sort === "title") orderBy = asc(objects.title)
  else if (query.sort === "backlinks") orderBy = desc(objects.backlinkCount)
  else if (query.sort === "views") orderBy = desc(objects.viewCount)

  const rows = await db
    .select()
    .from(objects)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(query.limit ?? 50)
    .offset(query.offset ?? 0)

  return rows.map(mapObjectRow)
}

export interface CreateObjectData {
  objectType: string
  slug: string
  title: string
  description: string
  authorId?: string
  status?: string
  visibility?: string
  language?: string
  difficulty?: string
  aliases?: string[]
  domains?: string[]
  tags?: string[]
  thumbnail?: string
  readingTime?: number
  wordCount?: number
}

export interface DomainData {
  concept?: Partial<typeof knowledge.concepts.$inferInsert>
  thinker?: Partial<typeof knowledge.thinkers.$inferInsert>
  book?: Partial<typeof knowledge.books.$inferInsert>
  article?: Partial<typeof knowledge.articles.$inferInsert>
  theory?: Partial<typeof knowledge.theories.$inferInsert>
  school?: Partial<typeof knowledge.schools.$inferInsert>
  discipline?: Partial<typeof knowledge.disciplines.$inferInsert>
  symbol?: Partial<typeof knowledge.symbols.$inferInsert>
  quote?: Partial<typeof knowledge.quotes.$inferInsert>
  timeline_event?: Partial<typeof knowledge.timelineEvents.$inferInsert>
}

export async function createObject(
  db: DB,
  data: CreateObjectData,
  domainData?: DomainData,
): Promise<ObjectResult> {
  const result = await db.transaction(async (tx) => {
    const rows = await tx
      .insert(objects)
      .values({
        objectType: data.objectType,
        slug: data.slug,
        title: data.title,
        description: data.description,
        authorId: data.authorId,
        status: (data.status ?? "draft") as "draft" | "review" | "published" | "archived",
        visibility: data.visibility ?? "public",
        language: (data.language ?? "th") as "th" | "en",
        difficulty:
          (data.difficulty ?? "intermediate") as "beginner" | "intermediate" | "advanced",
        aliases: data.aliases ?? [],
        domains: data.domains ?? [],
        tags: data.tags ?? [],
        thumbnail: data.thumbnail,
        readingTime: data.readingTime,
        wordCount: data.wordCount,
      })
      .returning()

    const obj = rows[0]!

    if (domainData) {
      const domainTable = getDomainTable(data.objectType)
      const domainValues = domainData[data.objectType as keyof DomainData]
      if (domainTable && domainValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await tx.insert(domainTable as any).values({
          ...domainValues,
          objectId: obj.id,
        })
      }
    }

    return obj
  })

  return mapObjectRow(result)
}

export async function updateObject(
  db: DB,
  id: string,
  data: Partial<CreateObjectData>,
): Promise<ObjectResult | null> {
  const setData: Record<string, unknown> = {}
  if (data.title !== undefined) setData.title = data.title
  if (data.description !== undefined) setData.description = data.description
  if (data.status !== undefined) setData.status = data.status
  if (data.visibility !== undefined) setData.visibility = data.visibility
  if (data.language !== undefined) setData.language = data.language
  if (data.difficulty !== undefined) setData.difficulty = data.difficulty
  if (data.aliases !== undefined) setData.aliases = data.aliases
  if (data.domains !== undefined) setData.domains = data.domains
  if (data.tags !== undefined) setData.tags = data.tags
  if (data.thumbnail !== undefined) setData.thumbnail = data.thumbnail
  if (data.readingTime !== undefined) setData.readingTime = data.readingTime
  if (data.wordCount !== undefined) setData.wordCount = data.wordCount

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await db.update(objects).set(setData as any).where(eq(objects.id, id)).returning()
  const obj = rows[0]
  if (!obj) return null
  return mapObjectRow(obj)
}

export async function softDeleteObject(db: DB, id: string): Promise<void> {
  await db
    .update(objects)
    .set({ deletedAt: new Date() })
    .where(eq(objects.id, id))
}

export async function publishObject(db: DB, id: string): Promise<ObjectResult | null> {
  const rows = await db
    .update(objects)
    .set({
      status: "published" as const,
      publishedAt: new Date(),
    })
    .where(eq(objects.id, id))
    .returning()

  const obj = rows[0]
  if (!obj) return null
  return mapObjectRow(obj)
}

export async function incrementViewCount(db: DB, id: string): Promise<void> {
  await db
    .update(objects)
    .set({ viewCount: sql`${objects.viewCount} + 1` })
    .where(eq(objects.id, id))
}
