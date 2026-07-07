export interface SearchQuery {
  term: string
  objectTypes?: string[]
  domains?: string[]
  tags?: string[]
  language?: "th" | "en"
  difficulty?: "beginner" | "intermediate" | "advanced"
  status?: "draft" | "review" | "published" | "archived"
  limit?: number
  offset?: number
  sort?: "relevance" | "recent" | "views" | "backlinks"
  fuzzy?: boolean
}

export interface SearchResult {
  id: string
  objectType: string
  slug: string
  title: string
  description: string
  language: string
  difficulty: string
  status: string
  aliases: string[]
  domains: string[]
  tags: string[]
  thumbnail?: string
  readingTime?: number
  wordCount?: number
  viewCount: number
  backlinkCount: number
  rank: number
  headline: string
  publishedAt?: string
  createdAt: string
}

export interface SearchFacets {
  objectTypes: { value: string; count: number }[]
  domains: { value: string; count: number }[]
  tags: { value: string; count: number }[]
  difficulties: { value: string; count: number }[]
  languages: { value: string; count: number }[]
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  pageSize: number
  facets: SearchFacets
  took: number
}

export interface AutocompleteResult {
  value: string
  label: string
  type: "concept" | "thinker" | "theory" | "school" | "discipline" | "book" | "article" | "symbol" | "tag" | "alias"
  slug?: string
  description?: string
}
