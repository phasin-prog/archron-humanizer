// ============================================
// SHARED CONSTANTS
// ============================================

export const OBJECT_TYPE_LABELS: Record<string, string> = {
  concept: "Concept",
  thinker: "Thinker",
  theory: "Theory",
  school: "School",
  discipline: "Discipline",
  book: "Book",
  article: "Article",
  quote: "Quote",
  symbol: "Symbol",
  timeline_event: "Timeline Event",
  guide: "Guide",
  collection: "Collection",
}

export const RELATION_TYPE_LABELS: Record<string, string> = {
  influences: "Influences",
  influenced_by: "Influenced By",
  relates_to: "Relates To",
  part_of: "Part Of",
  contains: "Contains",
  precedes: "Precedes",
  follows: "Follows",
  contradicts: "Contradicts",
  supports: "Supports",
  cites: "Cites",
}

export const USER_ROLE_PERMISSIONS = {
  guest: ["read"],
  user: ["read", "bookmark", "comment"],
  contributor: ["read", "bookmark", "comment", "create_draft"],
  editor: ["read", "bookmark", "comment", "create_draft", "edit_own", "publish_own"],
  admin: ["read", "bookmark", "comment", "create_draft", "edit_own", "publish_own", "edit_all", "publish_all", "delete", "manage_users"],
} as const

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const READING_WORDS_PER_MINUTE = 200
export const SEARCH_DEBOUNCE_MS = 300
export const AUTOCOMPLETE_MIN_CHARS = 2
export const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
