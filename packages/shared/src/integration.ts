// ============================================
// INTEGRATION LAYER — Connect all packages
// ============================================

/**
 * Central integration point for all Archron services
 */
export interface ArchronServices {
  db: any
  knowledgeEngine: any
  searchEngine: any
}

/**
 * Initialize all services with dependencies
 */
export async function initializeServices(_config: {
  databaseUrl: string
}): Promise<ArchronServices> {
  // TODO: Implement service initialization when database is ready
  // For now, return mock services to allow build to pass
  return {
    db: null as any,
    knowledgeEngine: null as any,
    searchEngine: null as any,
  }

  // Original implementation (commented until database setup is complete):
  // const { db } = await import("@archron/database")
  // const { KnowledgeEngine } = await import("@archron/knowledge-engine")
  // const { SearchEngine } = await import("@archron/search")
  // const searchEngine = new SearchEngine({ db })
  // const knowledgeEngine = new KnowledgeEngine({ db, searchEngine })
  // return { db, knowledgeEngine, searchEngine }
}

/**
 * Service context for use in API routes and server components
 */
export class ServiceContext {
  constructor(private services: ArchronServices) {}

  get db() {
    return this.services.db
  }

  get knowledge() {
    return this.services.knowledgeEngine
  }

  get search() {
    return this.services.searchEngine
  }

  async getObject(slug: string): Promise<any | null> {
    return this.services.knowledgeEngine.getObject(slug)
  }

  async searchObjects(term: string, options?: {
    types?: string[]
    limit?: number
  }): Promise<any> {
    return this.services.searchEngine.search({
      term,
      types: options?.types as any,
      limit: options?.limit,
    })
  }

  async getRelations(objectId: string): Promise<any[]> {
    return this.services.knowledgeEngine.getRelations({
      objectId,
      direction: "both",
    })
  }

  async getBacklinks(objectId: string): Promise<any[]> {
    return this.services.knowledgeEngine.getBacklinks(objectId)
  }

  async getRecommendations(objectId: string, limit?: number): Promise<any[]> {
    return this.services.knowledgeEngine.getRecommendations(objectId, limit)
  }
}

/**
 * Global service instance (singleton)
 */
let globalServices: ArchronServices | null = null

export async function getServices(): Promise<ArchronServices> {
  if (!globalServices) {
    const databaseUrl = typeof process !== "undefined" && process.env ? process.env.DATABASE_URL : ""
    globalServices = await initializeServices({
      databaseUrl: databaseUrl || "",
    })
  }
  return globalServices
}

export async function getServiceContext(): Promise<ServiceContext> {
  const services = await getServices()
  return new ServiceContext(services)
}
