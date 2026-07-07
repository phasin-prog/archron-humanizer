import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { contentStateEnum, notificationTypeEnum } from "./enums";
import { objects, users } from "./core";
import { sql } from "drizzle-orm";
export const drafts = pgTable("drafts", {
    id: uuid("id").defaultRandom().primaryKey(),
    objectId: uuid("object_id").references(() => objects.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 500 }),
    body: text("body"),
    status: contentStateEnum("status").default("draft").notNull(),
    currentVersion: integer("current_version").default(1).notNull(),
    lastSavedAt: timestamp("last_saved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql `now()`).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql `now()`).notNull(),
});
export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id),
    parentId: uuid("parent_id"),
    body: text("body").notNull(),
    isResolved: boolean("is_resolved").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql `now()`).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql `now()`).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
export const media = pgTable("media", {
    id: uuid("id").defaultRandom().primaryKey(),
    objectId: uuid("object_id").references(() => objects.id, { onDelete: "set null" }),
    uploaderId: uuid("uploader_id").notNull().references(() => users.id),
    filename: varchar("filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    url: varchar("url", { length: 2048 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 2048 }),
    altText: varchar("alt_text", { length: 500 }),
    width: integer("width"),
    height: integer("height"),
    duration: integer("duration"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql `now()`).notNull(),
});
export const tags = pgTable("tags", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).unique().notNull(),
    slug: varchar("slug", { length: 50 }).unique().notNull(),
    description: varchar("description", { length: 280 }),
    color: varchar("color", { length: 7 }),
    usageCount: integer("usage_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql `now()`).notNull(),
});
export const objectTags = pgTable("object_tags", {
    id: uuid("id").defaultRandom().primaryKey(),
    objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    taggedAt: timestamp("tagged_at", { withTimezone: true }).default(sql `now()`).notNull(),
});
export const notifications = pgTable("notifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body"),
    isRead: boolean("is_read").default(false).notNull(),
    actorId: uuid("actor_id").references(() => users.id),
    objectId: uuid("object_id").references(() => objects.id),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql `now()`).notNull(),
});
