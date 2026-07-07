// ============================================
// SHARED TYPES — used across all packages
// ============================================

// Knowledge Object Types
export type ObjectType =
  | "concept"
  | "thinker"
  | "theory"
  | "school"
  | "discipline"
  | "book"
  | "article"
  | "quote"
  | "symbol"
  | "timeline_event"
  | "guide"
  | "collection"

export type ObjectStatus = "draft" | "review" | "published" | "archived"

export interface BaseObject {
  id: string
  type: ObjectType
  slug: string
  title: string
  description: string | null
  content: string
  status: ObjectStatus
  authorId: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  tags: string[]
  metadata: Record<string, unknown>
}

// Query & Result Types
export interface ObjectQuery {
  types?: ObjectType[]
  status?: ObjectStatus[]
  authorId?: string
  tags?: string[]
  search?: string
  sort?: "recent" | "popular" | "alphabetical"
  limit?: number
  offset?: number
}

export interface ObjectResult extends BaseObject {
  backlinkCount: number
  viewCount: number
  bookmarkCount: number
}

// Relationship Types
export type RelationType =
  | "influences"
  | "influenced_by"
  | "relates_to"
  | "part_of"
  | "contains"
  | "precedes"
  | "follows"
  | "contradicts"
  | "supports"
  | "cites"

export interface Relationship {
  id: string
  sourceId: string
  targetId: string
  type: RelationType
  weight: number
  metadata: Record<string, unknown>
  createdAt: Date
}

export interface RelationQuery {
  objectId: string
  direction?: "incoming" | "outgoing" | "both"
  types?: RelationType[]
  limit?: number
}

export interface RelationResult extends Relationship {
  sourceObject?: ObjectResult
  targetObject?: ObjectResult
}

// User & Auth Types
export type UserRole = "guest" | "user" | "contributor" | "editor" | "admin"

export interface UserProfile {
  id: string
  clerkId: string
  username: string
  displayName: string
  email: string
  role: UserRole
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

// Search Types
export interface SearchFacet {
  field: string
  value: string
  count: number
}

export interface SearchQuery {
  term: string
  types?: ObjectType[]
  tags?: string[]
  limit?: number
  offset?: number
  facets?: string[]
}

export interface SearchResult {
  id: string
  type: ObjectType
  slug: string
  title: string
  description: string | null
  excerpt: string
  score: number
  highlights: Record<string, string[]>
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  facets: Record<string, SearchFacet[]>
  took: number
}

export interface AutocompleteResult {
  id: string
  type: ObjectType
  slug: string
  title: string
  score: number
}
