import type { ObjectQuery, ObjectResult, RelationQuery, RelationResult } from "@archron/shared"
import type { DB } from "@archron/database"
import { findObjectBySlug, findObjectById, listObjects } from "@archron/database/objects"
import { findRelations } from "@archron/database/relationships"

export interface KnowledgeEngineOptions {
  db: DB
  searchEngine?: unknown
  cache?: Map<string, unknown>
}

export class KnowledgeEngine {
  private db: DB
  private searchEngine: unknown
  private cache: Map<string, unknown>

  constructor(options: KnowledgeEngineOptions) {
    this.db = options.db
    this.searchEngine = options.searchEngine
    this.cache = options.cache ?? new Map()
  }

  async getObject(slug: string): Promise<ObjectResult | null> {
    const cached = this.cache.get(`object:${slug}`) as ObjectResult | undefined
    if (cached) return cached

    const obj = await findObjectBySlug(this.db, slug)
    if (obj) {
      this.cache.set(`object:${slug}`, obj)
      return obj
    }

    if (
      this.searchEngine &&
      typeof (this.searchEngine as { search: Function }).search === "function"
    ) {
      const results = await (this.searchEngine as { search: Function }).search({
        term: slug,
        limit: 1,
      })
      if (results?.results?.[0]) {
        const obj = results.results[0] as ObjectResult
        this.cache.set(`object:${slug}`, obj)
        return obj
      }
    }

    return null
  }

  async getRelations(query: RelationQuery): Promise<RelationResult[]> {
    const cacheKey = `relations:${JSON.stringify(query)}`
    const cached = this.cache.get(cacheKey) as RelationResult[] | undefined
    if (cached) return cached

    const results = await findRelations(this.db, query)
    this.cache.set(cacheKey, results)
    return results
  }

  async getBacklinks(objectId: string): Promise<ObjectResult[]> {
    const cacheKey = `backlinks:${objectId}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const relations = await findRelations(this.db, {
      objectId,
      direction: "incoming",
    })
    const sourceIds = relations.map((r) => r.sourceId)
    if (sourceIds.length === 0) {
      this.cache.set(cacheKey, [])
      return []
    }

    const results: ObjectResult[] = []
    for (const id of sourceIds) {
      const obj = await findObjectById(this.db, id)
      if (obj) results.push(obj)
    }

    this.cache.set(cacheKey, results)
    return results
  }

  async getTimeline(limit: number = 20): Promise<ObjectResult[]> {
    const cacheKey = `timeline:${limit}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const results = await listObjects(this.db, {
      types: ["timeline_event"],
      sort: "recent",
      limit,
    })
    this.cache.set(cacheKey, results)
    return results
  }

  async getRecommendations(
    objectId: string,
    limit: number = 5,
  ): Promise<ObjectResult[]> {
    const cacheKey = `recommend:${objectId}:${limit}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const relations = await findRelations(this.db, {
      objectId,
      direction: "both",
    })
    const relatedIds = relations.map((r) =>
      r.sourceId === objectId ? r.targetId : r.sourceId,
    )

    if (relatedIds.length === 0) {
      this.cache.set(cacheKey, [])
      return []
    }

    const results: ObjectResult[] = []
    for (const id of [...new Set(relatedIds)]) {
      const obj = await findObjectById(this.db, id)
      if (obj) results.push(obj)
    }

    results.sort((a, b) => b.backlinkCount - a.backlinkCount)
    const top = results.slice(0, limit)
    this.cache.set(cacheKey, top)
    return top
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }
}

export type { ObjectQuery, ObjectResult, RelationQuery, RelationResult }
