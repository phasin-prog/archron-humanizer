export const ObjectTypes = {
  Concept: "concept",
  Thinker: "thinker",
  Theory: "theory",
  School: "school",
  Discipline: "discipline",
  Book: "book",
  Article: "article",
  Symbol: "symbol",
  Quote: "quote",
  TimelineEvent: "timeline_event",
  Glossary: "glossary",
  Term: "term",
  Guide: "guide",
  Collection: "collection",
  Media: "media",
  Reference: "reference",
} as const

export type ObjectType = (typeof ObjectTypes)[keyof typeof ObjectTypes]

export interface BaseObject {
  id: string
  slug: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface Concept extends BaseObject {
  type: typeof ObjectTypes.Concept
  description: string
  summary: string
}

export interface Thinker extends BaseObject {
  type: typeof ObjectTypes.Thinker
  fullName: string
  birth?: string
  death?: string
  nationality?: string
  summary: string
}

export interface Theory extends BaseObject {
  type: typeof ObjectTypes.Theory
  summary: string
  tenets: string[]
}

export interface School extends BaseObject {
  type: typeof ObjectTypes.School
  summary: string
  originPeriod?: string
}

export interface Discipline extends BaseObject {
  type: typeof ObjectTypes.Discipline
  summary: string
}

export interface Book extends BaseObject {
  type: typeof ObjectTypes.Book
  subtitle?: string
  publishedYear?: number
  summary: string
}

export interface Article extends BaseObject {
  type: typeof ObjectTypes.Article
  summary: string
  body: string
}

export interface Symbol extends BaseObject {
  type: typeof ObjectTypes.Symbol
  description: string
  significance: string
}

export interface Quote extends BaseObject {
  type: typeof ObjectTypes.Quote
  text: string
  source: string
}

export interface TimelineEvent extends BaseObject {
  type: typeof ObjectTypes.TimelineEvent
  eventDate: string
  description: string
}

export interface Glossary extends BaseObject {
  type: typeof ObjectTypes.Glossary
  summary: string
}

export interface Term extends BaseObject {
  type: typeof ObjectTypes.Term
  definition: string
  glossaryId: string
}

export type KnowledgeObject =
  | Concept
  | Thinker
  | Theory
  | School
  | Discipline
  | Book
  | Article
  | Symbol
  | Quote
  | TimelineEvent
  | Glossary
  | Term
