import { pgTable, uuid, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core"
import { relationTypeEnum, weightEnum, confidenceEnum } from "./enums"
import { objects } from "./core"
import { sql } from "drizzle-orm"

export const relationships = pgTable("relationships", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  targetId: uuid("target_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  relationType: relationTypeEnum("relation_type").notNull(),
  weight: weightEnum("weight").default("primary").notNull(),
  confidence: confidenceEnum("confidence").default("suggested").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const graphNodes = pgTable("graph_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  objectId: uuid("object_id").notNull().references(() => objects.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 200 }).notNull(),
  nodeType: varchar("node_type", { length: 50 }).notNull(),
  position: jsonb("position"),
  influenceScore: integer("influence_score").default(0).notNull(),
  degree: integer("degree").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})

export const graphEdges = pgTable("graph_edges", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceNodeId: uuid("source_node_id").notNull().references(() => graphNodes.id, { onDelete: "cascade" }),
  targetNodeId: uuid("target_node_id").notNull().references(() => graphNodes.id, { onDelete: "cascade" }),
  relationshipId: uuid("relationship_id").references(() => relationships.id, { onDelete: "set null" }),
  label: varchar("label", { length: 200 }),
  weight: integer("weight").default(1).notNull(),
  direction: varchar("direction", { length: 20 }).default("directed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
})
