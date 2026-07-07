import type { ObjectType } from "./knowledge"

export const ContentStates = {
  Draft: "draft",
  Review: "review",
  Published: "published",
  Archived: "archived",
} as const

export type ContentState = (typeof ContentStates)[keyof typeof ContentStates]

export interface Reference {
  id: string
  targetType: ObjectType
  targetId: string
  citation: string
  url?: string
  createdAt: Date
}

export interface Media {
  id: string
  objectType: ObjectType
  objectId: string
  url: string
  alt?: string
  width?: number
  height?: number
  mimeType: string
  uploadedBy: string
  createdAt: Date
}

export interface Comment {
  id: string
  objectType: ObjectType
  objectId: string
  authorId: string
  body: string
  createdAt: Date
  updatedAt: Date
}
