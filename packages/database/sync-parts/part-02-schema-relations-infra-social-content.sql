-- ============================================================
-- ARCHRON — Part 02/06: Schema — Relationships + Infra + Social + Content
-- DB = Supabase (PostgreSQL)
-- ------------------------------------------------------------
-- ต้องรันหลัง Part 01
-- สร้าง: relationships/graph + slugs/aliases/revisions/search/references
--         + collections/guides/achievements + drafts/comments/media/tags/notifications
-- Idempotent
-- ============================================================

-- ===== RELATIONSHIPS & GRAPH =====
CREATE TABLE IF NOT EXISTS relationships (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id    uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  target_id    uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  relation_type relation_type NOT NULL,
  weight       weight DEFAULT 'primary' NOT NULL,
  confidence   confidence DEFAULT 'suggested' NOT NULL,
  metadata     jsonb,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS graph_nodes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id      uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  label          varchar(200) NOT NULL,
  node_type      varchar(50) NOT NULL,
  position       jsonb,
  influence_score integer DEFAULT 0 NOT NULL,
  degree         integer DEFAULT 0 NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS graph_edges (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_node_id  uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  target_node_id  uuid NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  relationship_id uuid REFERENCES relationships(id) ON DELETE SET NULL,
  label           varchar(200),
  weight          integer DEFAULT 1 NOT NULL,
  direction       varchar(20) DEFAULT 'directed' NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

-- ===== INFRASTRUCTURE =====
CREATE TABLE IF NOT EXISTS slugs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id  uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  slug       varchar(200) UNIQUE NOT NULL,
  locale     varchar(10) DEFAULT 'th' NOT NULL,
  is_active  boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS slug_redirects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_slug      varchar(200) NOT NULL,
  new_slug      varchar(200) NOT NULL,
  object_id     uuid REFERENCES objects(id) ON DELETE CASCADE,
  redirect_type varchar(20) DEFAULT '301' NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS aliases (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id  uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  name       varchar(200) NOT NULL,
  alias_type varchar(50) DEFAULT 'alternate_name' NOT NULL,
  language   varchar(10) DEFAULT 'th',
  is_primary boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS revisions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id        uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  user_id          uuid REFERENCES users(id),
  revision_type    revision_type NOT NULL,
  content_snapshot text,
  change_summary   varchar(500),
  version          integer NOT NULL,
  created_at       timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS search_index (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id      uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  content_type   content_type NOT NULL,
  vector         text,
  searchable_text text,
  rank           integer DEFAULT 0 NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "references" (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           varchar(500) NOT NULL,
  authors         text[],
  source          varchar(500),
  url             varchar(2048),
  doi             varchar(255),
  publish_year    integer,
  citation_format varchar(20) DEFAULT 'apa' NOT NULL,
  full_citation   text,
  created_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS object_references (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id    uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  reference_id uuid NOT NULL REFERENCES "references"(id) ON DELETE CASCADE,
  context      text,
  page_number  varchar(20),
  confidence   confidence DEFAULT 'suggested' NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL
);

-- ===== SOCIAL =====
CREATE TABLE IF NOT EXISTS collections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        varchar(200) NOT NULL,
  description text,
  is_public   boolean DEFAULT false NOT NULL,
  is_pinned   boolean DEFAULT false NOT NULL,
  item_count  integer DEFAULT 0 NOT NULL,
  cover_url   varchar(512),
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  object_id     uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  notes         text,
  sort_order    integer DEFAULT 0 NOT NULL,
  added_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      uuid NOT NULL REFERENCES users(id),
  title           varchar(300) NOT NULL,
  description     text,
  estimated_hours integer,
  is_published    boolean DEFAULT false NOT NULL,
  lesson_count    integer DEFAULT 0 NOT NULL,
  enrollment_count integer DEFAULT 0 NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS guide_lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id         uuid NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  title            varchar(300) NOT NULL,
  content          text,
  object_refs      uuid[],
  sequence         integer NOT NULL,
  estimated_minutes integer,
  is_optional      boolean DEFAULT false NOT NULL,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        varchar(50) UNIQUE NOT NULL,
  name        varchar(200) NOT NULL,
  description varchar(500) NOT NULL,
  icon        varchar(50),
  points      integer DEFAULT 0 NOT NULL,
  criteria    jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at     timestamptz DEFAULT now() NOT NULL,
  progress      integer DEFAULT 100 NOT NULL
);

CREATE TABLE IF NOT EXISTS reputation_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type   varchar(50) NOT NULL,
  points       integer NOT NULL,
  reason       varchar(300),
  reference_id uuid,
  created_at   timestamptz DEFAULT now() NOT NULL
);

-- ===== CONTENT LAYER =====
CREATE TABLE IF NOT EXISTS drafts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id      uuid REFERENCES objects(id) ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES users(id),
  title          varchar(500),
  body           text,
  status         content_state DEFAULT 'draft' NOT NULL,
  current_version integer DEFAULT 1 NOT NULL,
  last_saved_at  timestamptz,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id  uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id),
  parent_id  uuid,
  body       text NOT NULL,
  is_resolved boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS media (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id     uuid REFERENCES objects(id) ON DELETE SET NULL,
  uploader_id   uuid NOT NULL REFERENCES users(id),
  filename      varchar(255) NOT NULL,
  mime_type     varchar(100) NOT NULL,
  size          integer NOT NULL,
  url           varchar(2048) NOT NULL,
  thumbnail_url varchar(2048),
  alt_text      varchar(500),
  width         integer,
  height        integer,
  duration      integer,
  metadata      jsonb,
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar(50) UNIQUE NOT NULL,
  slug        varchar(50) UNIQUE NOT NULL,
  description varchar(280),
  color       varchar(7),
  usage_count integer DEFAULT 0 NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS object_tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id  uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tagged_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      varchar(200) NOT NULL,
  body       text,
  is_read    boolean DEFAULT false NOT NULL,
  actor_id   uuid REFERENCES users(id),
  object_id  uuid REFERENCES objects(id),
  metadata   jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ===== Part 02 END — ต่อด้วย Part 03 =====
