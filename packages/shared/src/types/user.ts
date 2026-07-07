export const Roles = {
  Guest: "guest",
  Member: "member",
  Writer: "writer",
  Reviewer: "reviewer",
  Editor: "editor",
  Administrator: "administrator",
} as const

export type Role = (typeof Roles)[keyof typeof Roles]

export const RoleHierarchy: Record<Role, number> = {
  guest: 0,
  member: 1,
  writer: 2,
  reviewer: 3,
  editor: 4,
  administrator: 5,
} as const

export interface User {
  id: string
  email: string
  role: Role
  profileId: string
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  userId: string
  displayName: string
  bio?: string
  avatarUrl?: string
  reputation: number
  createdAt: Date
  updatedAt: Date
}
