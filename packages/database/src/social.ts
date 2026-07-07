import { eq, asc, sql } from "drizzle-orm"
import type { DB } from "./db"
import {
  collections,
  collectionItems,
  guides,
  guideLessons,
  achievements,
  userAchievements,
  reputationEvents,
} from "./schema/social"

// --- Collections ---

export async function getCollection(db: DB, id: string) {
  const [col] = await db
    .select()
    .from(collections)
    .where(eq(collections.id, id))
    .limit(1)
  if (!col) return null

  const items = await db
    .select()
    .from(collectionItems)
    .where(eq(collectionItems.collectionId, id))
    .orderBy(asc(collectionItems.sortOrder))

  return { ...col, items }
}

export async function listCollections(db: DB, ownerId: string) {
  return db
    .select()
    .from(collections)
    .where(eq(collections.ownerId, ownerId))
    .orderBy(asc(collections.createdAt))
}

export async function createCollection(
  db: DB,
  data: { ownerId: string; name: string; description?: string; isPublic?: boolean },
) {
  const [col] = await db
    .insert(collections)
    .values({
      ownerId: data.ownerId,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic ?? false,
    })
    .returning()
  return col
}

export async function addCollectionItem(
  db: DB,
  data: { collectionId: string; objectId: string; notes?: string; sortOrder?: number },
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.insert(collectionItems).values({
      collectionId: data.collectionId,
      objectId: data.objectId,
      notes: data.notes,
      sortOrder: data.sortOrder ?? 0,
    })
    await tx
      .update(collections)
      .set({ itemCount: sql`${collections.itemCount} + 1` })
      .where(eq(collections.id, data.collectionId))
  })
}

export async function removeCollectionItem(db: DB, itemId: string): Promise<void> {
  const [item] = await db
    .select()
    .from(collectionItems)
    .where(eq(collectionItems.id, itemId))
    .limit(1)

  if (item) {
    await db.transaction(async (tx) => {
      await tx
        .delete(collectionItems)
        .where(eq(collectionItems.id, itemId))
      await tx
        .update(collections)
        .set({ itemCount: sql`GREATEST(${collections.itemCount} - 1, 0)` })
        .where(eq(collections.id, item.collectionId))
    })
  }
}

export async function deleteCollection(db: DB, id: string): Promise<void> {
  await db.delete(collections).where(eq(collections.id, id))
}

// --- Guides ---

export async function getGuide(db: DB, id: string) {
  const [guide] = await db
    .select()
    .from(guides)
    .where(eq(guides.id, id))
    .limit(1)
  if (!guide) return null

  const lessons = await db
    .select()
    .from(guideLessons)
    .where(eq(guideLessons.guideId, id))
    .orderBy(asc(guideLessons.sequence))

  return { ...guide, lessons }
}

export async function listGuides(
  db: DB,
  query: { creatorId?: string; isPublished?: boolean; limit?: number; offset?: number } = {},
) {
  const conditions = []
  if (query.creatorId) conditions.push(eq(guides.creatorId, query.creatorId))
  if (query.isPublished !== undefined) conditions.push(eq(guides.isPublished, query.isPublished))

  return db
    .select()
    .from(guides)
    .where(conditions.length > 0 ? conditions.reduce((a, b) => sql`${a} AND ${b}`) : undefined)
    .limit(query.limit ?? 20)
    .offset(query.offset ?? 0)
}

export async function createGuide(
  db: DB,
  data: { creatorId: string; title: string; description?: string; estimatedHours?: number },
) {
  const [guide] = await db
    .insert(guides)
    .values({
      creatorId: data.creatorId,
      title: data.title,
      description: data.description,
      estimatedHours: data.estimatedHours,
    })
    .returning()
  return guide
}

// --- Achievements ---

export async function grantAchievement(
  db: DB,
  userId: string,
  achievementCode: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    const [achievement] = await tx
      .select()
      .from(achievements)
      .where(eq(achievements.code, achievementCode))
      .limit(1)

    if (!achievement) return

    const [existing] = await tx
      .select()
      .from(userAchievements)
      .where(
        sql`${userAchievements.userId} = ${userId} AND ${userAchievements.achievementId} = ${achievement.id}`,
      )
      .limit(1)

    if (existing) return

    await tx.insert(userAchievements).values({
      userId,
      achievementId: achievement.id,
    })

    await tx.insert(reputationEvents).values({
      userId,
      eventType: "achievement_earned",
      points: achievement.points,
      reason: achievement.name,
      referenceId: achievement.id,
    })
  })
}
