import { eq, and, inArray, sql } from "drizzle-orm"
import type { RelationQuery, RelationResult } from "@archron/shared"
import type { DB } from "./db"
import { objects } from "./schema/core"
import { relationships, graphNodes, graphEdges } from "./schema/relationships"

function mapRelationRow(row: any): RelationResult {
  return {
    id: row.id,
    sourceId: row.source_id,
    targetId: row.target_id,
    relationType: row.relation_type,
    weight: row.weight,
    confidence: row.confidence,
  }
}

export async function findRelations(
  db: DB,
  query: RelationQuery,
): Promise<RelationResult[]> {
  const conditions = []
  const { objectId, relationTypes, direction = "both" } = query

  if (direction === "outgoing") {
    conditions.push(eq(relationships.sourceId, objectId))
  } else if (direction === "incoming") {
    conditions.push(eq(relationships.targetId, objectId))
  } else {
    conditions.push(
      sql`(${relationships.sourceId} = ${objectId} OR ${relationships.targetId} = ${objectId})`,
    )
  }

  if (relationTypes?.length) {
    conditions.push(inArray(relationships.relationType, relationTypes as any))
  }

  const rows = await db
    .select()
    .from(relationships)
    .where(and(...conditions))
    .limit(query.limit ?? 50)
    .offset(query.offset ?? 0)

  return rows.map(mapRelationRow)
}

export interface CreateRelationData {
  sourceId: string
  targetId: string
  relationType: string
  weight?: string
  confidence?: string
}

export async function createRelation(
  db: DB,
  data: CreateRelationData,
): Promise<RelationResult> {
  const result = await db.transaction(async (tx) => {
    const [rel] = await tx
      .insert(relationships)
      .values({
        sourceId: data.sourceId,
        targetId: data.targetId,
        relationType: data.relationType as any,
        weight: (data.weight ?? "primary") as any,
        confidence: (data.confidence ?? "suggested") as any,
      })
      .returning()

    if (!rel) throw new Error("Failed to create relation")

    for (const objId of [data.sourceId, data.targetId]) {
      const [existing] = await tx
        .select()
        .from(graphNodes)
        .where(eq(graphNodes.objectId, objId))
        .limit(1)

      if (!existing) {
        const [obj] = await tx
          .select({ title: objects.title, objectType: objects.objectType })
          .from(objects)
          .where(eq(objects.id, objId))
          .limit(1)

        if (obj) {
          await tx.insert(graphNodes).values({
            objectId: objId,
            label: obj.title,
            nodeType: obj.objectType,
          })
        }
      }
    }

    const [sourceNode] = await tx
      .select()
      .from(graphNodes)
      .where(eq(graphNodes.objectId, data.sourceId))
      .limit(1)
    const [targetNode] = await tx
      .select()
      .from(graphNodes)
      .where(eq(graphNodes.objectId, data.targetId))
      .limit(1)

    if (sourceNode && targetNode) {
      await tx.insert(graphEdges).values({
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        relationshipId: rel.id,
        label: data.relationType,
      })
    }

    await tx
      .update(objects)
      .set({ backlinkCount: sql`${objects.backlinkCount} + 1` })
      .where(eq(objects.id, data.targetId))

    return rel
  })

  return mapRelationRow(result)
}

export async function removeRelation(db: DB, id: string): Promise<void> {
  await db.transaction(async (tx) => {
    const [rel] = await tx
      .select()
      .from(relationships)
      .where(eq(relationships.id, id))
      .limit(1)

    if (rel) {
      await tx
        .delete(graphEdges)
        .where(eq(graphEdges.relationshipId, id))

      await tx
        .delete(relationships)
        .where(eq(relationships.id, id))

      await tx
        .update(objects)
        .set({ backlinkCount: sql`GREATEST(${objects.backlinkCount} - 1, 0)` })
        .where(eq(objects.id, rel.targetId))
    }
  })
}

export async function getGraphEdges(
  db: DB,
  nodeId: string,
): Promise<typeof graphEdges.$inferSelect[]> {
  return db
    .select()
    .from(graphEdges)
    .where(
      sql`(${graphEdges.sourceNodeId} = ${nodeId} OR ${graphEdges.targetNodeId} = ${nodeId})`,
    )
}

export async function getGraphNodes(
  db: DB,
  query: { nodeType?: string; limit?: number; offset?: number } = {},
): Promise<typeof graphNodes.$inferSelect[]> {
  const conditions = []
  if (query.nodeType) {
    conditions.push(eq(graphNodes.nodeType, query.nodeType))
  }

  return db
    .select()
    .from(graphNodes)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(query.limit ?? 100)
    .offset(query.offset ?? 0)
}
