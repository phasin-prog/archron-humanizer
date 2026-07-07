import type { ObjectType } from "../types/knowledge"

export interface CategoryInfo {
  label: string
  color: string
  icon: string
}

export const CategoryMap: Record<ObjectType, CategoryInfo> = {
  concept: { label: "Concept", color: "#5B7FAB", icon: "brain" },
  thinker: { label: "Thinker", color: "#5A8A6A", icon: "user" },
  theory: { label: "Theory", color: "#8A7AB5", icon: "book-open" },
  school: { label: "School", color: "#5A8A8A", icon: "building" },
  discipline: { label: "Discipline", color: "#6A7A8A", icon: "globe" },
  book: { label: "Book", color: "#B58A5A", icon: "book" },
  article: { label: "Article", color: "#AB6B7A", icon: "file-text" },
  symbol: { label: "Symbol", color: "#C4A040", icon: "image" },
  quote: { label: "Quote", color: "#7A9A7A", icon: "quote" },
  timeline_event: { label: "Timeline Event", color: "#6A7A8A", icon: "clock" },
  glossary: { label: "Glossary", color: "#6A7AB5", icon: "bookmark" },
  term: { label: "Term", color: "#6A7AB5", icon: "type" },
  guide: { label: "Guide", color: "#6A7AB5", icon: "compass" },
  collection: { label: "Collection", color: "#8A7AB5", icon: "folder" },
  media: { label: "Media", color: "#7A8A9A", icon: "film" },
  reference: { label: "Reference", color: "#8A8A80", icon: "link" },
}
