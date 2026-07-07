import { pgEnum } from "drizzle-orm/pg-core";
export const contentTypeEnum = pgEnum("content_type", [
    "concept", "thinker", "theory", "school", "discipline",
    "book", "article", "symbol", "quote", "timeline_event",
    "glossary", "term", "guide", "collection", "media", "reference",
]);
export const contentStateEnum = pgEnum("content_state", [
    "draft", "review", "published", "archived",
]);
export const roleEnum = pgEnum("role", [
    "guest", "member", "supporter", "contributor",
    "writer", "reviewer", "editor", "curator", "administrator",
]);
export const difficultyEnum = pgEnum("difficulty", [
    "beginner", "intermediate", "advanced",
]);
export const languageEnum = pgEnum("language", ["th", "en"]);
export const relationTypeEnum = pgEnum("relation_type", [
    "created", "contains", "includes", "related_to", "opposes",
    "derives_from", "precedes", "influenced", "influenced_by",
    "authored", "appears_in", "referenced_in", "associated_with",
    "belongs_to", "analyzed_in", "supports", "represents", "involves",
]);
export const weightEnum = pgEnum("weight", [
    "primary", "secondary", "tertiary",
]);
export const confidenceEnum = pgEnum("confidence", [
    "verified", "suggested", "automatic",
]);
export const revisionTypeEnum = pgEnum("revision_type", [
    "draft_save", "review_submit", "review_changes",
    "publish", "archive", "correction",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
    "review_requested", "content_published", "achievement_earned",
    "comment_received", "mention", "level_up",
    "content_flagged", "review_decision",
]);
