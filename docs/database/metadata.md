# Metadata

Every Object carries structured metadata.

## Core Metadata (on objects table)

| Field | Purpose | Source |
|-------|---------|--------|
| `slug` | URL identity | Slug Engine |
| `title` | Display name | Writer |
| `status` | Lifecycle state | System |
| `visibility` | Access control | Writer |
| `language` | Content language | Writer |
| `description` | Short summary | Writer |
| `search_vector` | Full-text index | Auto-generated from title + description |

## Type-specific Metadata (on entity tables)

| Object | Metadata Fields |
|--------|----------------|
| Concept | definition, etymology, difficulty, reading_time |
| Thinker | birth_year, death_year, nationality, biography, reading_time |
| Book | publication_year, isbn, original_title, pages, publisher, summary, reading_time |
| Article | reading_time, difficulty, published_at |
| Theory | definition, overview, difficulty, reading_time |
| School | definition, historical_context, difficulty, reading_time |
| Discipline | definition, icon, reading_time |
| Symbol | image_url, meaning, origin, cultural_context, difficulty, reading_time |
| Quote | quote_text, source_id, page, context, thinker_id |
| Timeline Event | event_date, date_precision, significance, reading_time |

## SEO Metadata

Computed by the Renderer for every Object:

| Field | Value |
|-------|-------|
| `meta_title` | `"{title} — ARCHRON"` |
| `meta_description` | `object.description` (auto-truncated to 160 chars) |
| `canonical_url` | `https://archron.com/{type}/{slug}` |
| `og_type` | Based on Object type |
| `og_image` | `object.thumbnail` or system default |
| `json_ld` | Auto-generated structured data |

## Taxonomy Metadata

| Field | Source |
|-------|--------|
| `domains` | Array of linked Domain IDs |
| `schools` | Array of linked School IDs |
| `tags` | Array of linked Tag names |

## Metrics Metadata

Updated automatically by system:

| Field | Source |
|-------|--------|
| `view_count` | Page view counter (incremented via trigger) |
| `backlink_count` | Number of incoming relationships (recalculated on relationship change) |
| `reference_count` | Number of attached References |
| `related_count` | Number of related Objects |
| `word_count` | For Articles: body word count (computed on save) |
| `reading_time` | Estimated minutes (computed from word count) |
