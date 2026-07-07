import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core"
import { contentStateEnum, roleEnum, languageEnum, difficultyEnum } from "./enums"
import { sql } from "drizzle-orm"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 320 }).unique().notNull(),
  role: roleEnum("role").default("member").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  bio: varchar("bio", { length: 280 }),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  reputation: integer("reputation").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const objects = pgTable("objects", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectType: varchar("object_type", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  status: contentStateEnum("status").default("draft").notNull(),
  visibility: varchar("visibility", { length: 20 }).default("public").notNull(),
  language: languageEnum("language").default("th").notNull(),
  difficulty: difficultyEnum("difficulty").default("intermediate").notNull(),
  description: varchar("description", { length: 280 }).notNull(),
  aliases: text("aliases").array(),
  domains: varchar("domains", { length: 100 }).array(),
  tags: varchar("tags", { length: 50 }).array(),
  thumbnail: varchar("thumbnail", { length: 512 }),
  readingTime: integer("reading_time"),
  wordCount: integer("word_count"),
  viewCount: integer("view_count").default(0).notNull(),
  backlinkCount: integer("backlink_count").default(0).notNull(),
  version: integer("version").default(1).notNull(),
  authorId: uuid("author_id").references(() => users.id),
  editorId: uuid("editor_id").references(() => users.id),
  searchVector: text("search_vector"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})
