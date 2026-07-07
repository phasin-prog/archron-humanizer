export interface ObjectQuery {
  ids?: string[]
  slugs?: string[]
  types?: string[]
  status?: string[]
  language?: string
  difficulty?: string
  domains?: string[]
  tags?: string[]
  limit?: number
  offset?: number
  sort?: "recent" | "title" | "backlinks" | "views"
  includeDeleted?: boolean
}

export interface ObjectResult {
  id: string
  objectType: string
  slug: string
  title: string
  status: string
  visibility: string
  language: string
  difficulty: string
  description: string
  aliases: string[]
  domains: string[]
  tags: string[]
  thumbnail?: string
  readingTime?: number
  wordCount?: number
  viewCount: number
  backlinkCount: number
  version: number
  authorId?: string
  editorId?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface RelationQuery {
  objectId: string
  relationTypes?: string[]
  direction?: "outgoing" | "incoming" | "both"
  limit?: number
  offset?: number
}

export interface RelationResult {
  id: string
  sourceId: string
  targetId: string
  relationType: string
  weight: string
  confidence: string
  source?: ObjectResult
  target?: ObjectResult
}

export interface KnowledgeEngineOptions {
  db: unknown
  searchEngine?: unknown
  cache?: Map<string, unknown>
}

export class KnowledgeEngine {
  private db: unknown
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

export type {
  ObjectQuery,
  ObjectResult,
  RelationQuery,
  RelationResult,
  KnowledgeEngineOptions,
}
