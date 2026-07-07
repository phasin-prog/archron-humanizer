import type { ObjectType } from "./knowledge"

export interface Collection {
  id: string
  ownerId: string
  title: string
  description?: string
  objectIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Guide {
  id: string
  ownerId: string
  title: string
  summary: string
  lessons: Lesson[]
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  body: string
  objectType?: ObjectType
  objectSlug?: string
  order: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  iconUrl?: string
  createdAt: Date
}

export interface Level {
  id: string
  name: string
  requiredReputation: number
  badgeColor: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: Date
}

export type NotificationType =
  | "review_requested"
  | "content_published"
  | "achievement_earned"
  | "comment_received"
