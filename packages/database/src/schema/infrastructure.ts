import { pgTable, uuid, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core"
import { contentTypeEnum, confidenceEnum, revisionTypeEnum } from "./enums"
import { objects, users } from "./core"
import { sql } from "drizzle-orm"

export const slugs = pgTable("slugs", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  locale: varchar("locale", { length: 10 }).default("th").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const slugRedirects = pgTable("slug_redirects", {
  id: uuid("id").defaultRandom().primaryKey(),
  oldSlug: varchar("old_slug", { length: 200 }).notNull(),
  newSlug: varchar("new_slug", { length: 200 }).notNull(),
  objectId: uuid("object_id").references(() => objects.id, { onDelete: "cascade" }),
  redirectType: varchar("redirect_type", { length: 20 }).default("301").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const aliases = pgTable("aliases", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  aliasType: varchar("alias_type", { length: 50 }).default("alternate_name").notNull(),
  language: varchar("language", { length: 10 }).default("th"),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const revisions = pgTable("revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  revisionType: revisionTypeEnum("revision_type").notNull(),
  contentSnapshot: text("content_snapshot"),
  changeSummary: varchar("change_summary", { length: 500 }),
  version: integer("version").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const searchIndex = pgTable("search_index", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  contentType: contentTypeEnum("content_type").notNull(),
  vector: text("vector"),
  searchableText: text("searchable_text"),
  rank: integer("rank").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const references = pgTable("references", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  authors: text("authors").array(),
  source: varchar("source", { length: 500 }),
  url: varchar("url", { length: 2048 }),
  doi: varchar("doi", { length: 255 }),
  publishYear: integer("publish_year"),
  citationFormat: varchar("citation_format", { length: 20 }).default("apa").notNull(),
  fullCitation: text("full_citation"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const objectReferences = pgTable("object_references", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  referenceId: uuid("reference_id").notNull().references(() => references.id, { onDelete: "cascade" }),
  context: text("context"),
  pageNumber: varchar("page_number", { length: 20 }),
  confidence: confidenceEnum("confidence").default("suggested").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
})
