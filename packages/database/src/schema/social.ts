import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { objects, users } from "./core"

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  itemCount: integer("item_count").default(0).notNull(),
  coverUrl: varchar("cover_url", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const collectionItems = pgTable("collection_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  notes: text("notes"),
  sortOrder: integer("sort_order").default(0).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const guides = pgTable("guides", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id").notNull().references(() => users.id),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  estimatedHours: integer("estimated_hours"),
  isPublished: boolean("is_published").default(false).notNull(),
  lessonCount: integer("lesson_count").default(0).notNull(),
  enrollmentCount: integer("enrollment_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const guideLessons = pgTable("guide_lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  guideId: uuid("guide_id").notNull().references(() => guides.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content"),
  objectRefs: uuid("object_refs").array(),
  sequence: integer("sequence").notNull(),
  estimatedMinutes: integer("estimated_minutes"),
  isOptional: boolean("is_optional").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  points: integer("points").default(0).notNull(),
  criteria: jsonb("criteria"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at", { withTimezone: true }).default(sql`now()`).notNull(),
  progress: integer("progress").default(100).notNull(),
})

export const reputationEvents = pgTable("reputation_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  points: integer("points").notNull(),
  reason: varchar("reason", { length: 300 }),
  referenceId: uuid("reference_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})
