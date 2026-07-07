import type { ResolvedLink } from "../types"

export interface KnowledgeResolver {
  resolve(target: string): Promise<ResolvedLink | null>
  resolveBatch(targets: string[]): Promise<Map<string, ResolvedLink>>
  resolveBySlug(slug: string): Promise<ResolvedLink | null>
  resolveById(id: string): Promise<ResolvedLink | null>
}

export function createKnowledgeResolver(fetchFn: (target: string) => Promise<ResolvedLink | null>): KnowledgeResolver {
  return {
    async resolve(target: string): Promise<ResolvedLink | null> {
      return fetchFn(target)
    },
    async resolveBatch(targets: string[]): Promise<Map<string, ResolvedLink>> {
      const results = new Map<string, ResolvedLink>()
      const unique = [...new Set(targets)]
      const settled = await Promise.allSettled(unique.map(t => fetchFn(t)))
      for (let i = 0; i < unique.length; i++) {
        const r = settled[i]
        if (r.status === "fulfilled" && r.value) {
          results.set(unique[i], r.value)
        }
      }
      return results
    },
    async resolveBySlug(slug: string): Promise<ResolvedLink | null> {
      return fetchFn(slug)
    },
    async resolveById(id: string): Promise<ResolvedLink | null> {
      return fetchFn(id)
    },
  }
}
