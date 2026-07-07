import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core"
import { languageEnum, difficultyEnum } from "./enums"
import { objects } from "./core"
import { sql } from "drizzle-orm"

export const concepts = pgTable("concepts", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  definition: text("definition"),
  etymology: text("etymology"),
  relatedTerms: text("related_terms").array(),
  primaryDomain: varchar("primary_domain", { length: 100 }),
  isCore: boolean("is_core").default(false).notNull(),
  complexity: integer("complexity").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const thinkers = pgTable("thinkers", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  birthDate: varchar("birth_date", { length: 20 }),
  deathDate: varchar("death_date", { length: 20 }),
  nationality: varchar("nationality", { length: 100 }),
  era: varchar("era", { length: 100 }),
  bio: text("bio"),
  portraitUrl: varchar("portrait_url", { length: 512 }),
  isHighlighted: boolean("is_highlighted").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  isbn: varchar("isbn", { length: 20 }),
  publisher: varchar("publisher", { length: 200 }),
  publishYear: integer("publish_year"),
  edition: varchar("edition", { length: 100 }),
  pageCount: integer("page_count"),
  coverUrl: varchar("cover_url", { length: 512 }),
  language: languageEnum("language").default("th").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  body: text("body"),
  excerpt: text("excerpt"),
  footnotes: jsonb("footnotes"),
  isLongform: boolean("is_longform").default(false).notNull(),
  difficulty: difficultyEnum("difficulty").default("intermediate").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const theories = pgTable("theories", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  statement: text("statement"),
  principles: text("principles").array(),
  applications: text("applications").array(),
  isFoundational: boolean("is_foundational").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const schools = pgTable("schools", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  period: varchar("period", { length: 100 }),
  location: varchar("location", { length: 200 }),
  methodology: text("methodology"),
  keyThinkers: uuid("key_thinkers").array(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const disciplines = pgTable("disciplines", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  scope: text("scope"),
  subfields: text("subfields").array(),
  parentId: uuid("parent_id"),
  depth: integer("depth").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const symbols = pgTable("symbols", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  meaning: text("meaning"),
  archetype: varchar("archetype", { length: 100 }),
  culturalContext: text("cultural_context"),
  imageUrl: varchar("image_url", { length: 512 }),
  isUniversal: boolean("is_universal").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const quotes = pgTable("quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  speakerId: uuid("speaker_id").references(() => objects.id),
  sourceId: uuid("source_id").references(() => objects.id),
  pageNumber: integer("page_number"),
  context: text("context"),
  isHighlighted: boolean("is_highlighted").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const timelineEvents = pgTable("timeline_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  eventDate: varchar("event_date", { length: 50 }).notNull(),
  endDate: varchar("end_date", { length: 50 }),
  location: varchar("location", { length: 200 }),
  significance: text("significance"),
  isMajor: boolean("is_major").default(false).notNull(),
  precision: varchar("precision", { length: 20 }).default("year").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})
