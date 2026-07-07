import type { ObjectResult, RelationQuery, RelationResult } from "@archron/shared"
export type { ObjectQuery, ObjectResult, RelationQuery, RelationResult } from "@archron/shared"

export interface KnowledgeEngineOptions {
  db: unknown
  searchEngine?: unknown
  cache?: Map<string, unknown>
}

export class KnowledgeEngine {
  private searchEngine: unknown
  private cache: Map<string, unknown>

  constructor(options: KnowledgeEngineOptions) {
    void options.db
    this.searchEngine = options.searchEngine
    this.cache = options.cache ?? new Map()
  }

  async getObject(slug: string): Promise<ObjectResult | null> {
    const cached = this.cache.get(`object:${slug}`) as ObjectResult | undefined
    if (cached) return cached

    if (this.searchEngine && typeof (this.searchEngine as { search: Function }).search === "function") {
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

    const results: RelationResult[] = []
    this.cache.set(cacheKey, results)
    return results
  }

  async getBacklinks(objectId: string): Promise<ObjectResult[]> {
    const cacheKey = `backlinks:${objectId}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const results: ObjectResult[] = []
    this.cache.set(cacheKey, results)
    return results
  }

  async getTimeline(limit: number = 20): Promise<ObjectResult[]> {
    const cacheKey = `timeline:${limit}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const results: ObjectResult[] = []
    this.cache.set(cacheKey, results)
    return results
  }

  async getRecommendations(objectId: string, limit: number = 5): Promise<ObjectResult[]> {
    const cacheKey = `recommend:${objectId}:${limit}`
    const cached = this.cache.get(cacheKey) as ObjectResult[] | undefined
    if (cached) return cached

    const results: ObjectResult[] = []
    this.cache.set(cacheKey, results)
    return results
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }
}
