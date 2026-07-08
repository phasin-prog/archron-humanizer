-- ============================================================
-- ARCHRON — Part 01/06: Schema — Enums + Core + Knowledge
-- DB = Supabase (PostgreSQL)
-- ------------------------------------------------------------
-- ต้องรันก่อน Part 02-06
-- สร้าง: 16 enum types + pg_trgm + users/profiles/objects
--         + 10 knowledge type tables (concept→timeline_event)
-- Idempotent: รันซ้ำได้ ข้ามสิ่งที่มีอยู่แล้ว
-- ============================================================

-- ===== ENUM TYPES =====
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
    CREATE TYPE content_type AS ENUM (
      'concept','thinker','theory','school','discipline',
      'book','article','symbol','quote','timeline_event',
      'glossary','term','guide','collection','media','reference');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_state') THEN
    CREATE TYPE content_state AS ENUM ('draft','review','published','archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE role AS ENUM (
      'guest','member','supporter','contributor',
      'writer','reviewer','editor','curator','administrator');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty') THEN
    CREATE TYPE difficulty AS ENUM ('beginner','intermediate','advanced');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language') THEN
    CREATE TYPE language AS ENUM ('th','en');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relation_type') THEN
    CREATE TYPE relation_type AS ENUM (
      'created','contains','includes','related_to','opposes',
      'derives_from','precedes','influenced','influenced_by',
      'authored','appears_in','referenced_in','associated_with',
      'belongs_to','analyzed_in','supports','represents','involves');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight') THEN
    CREATE TYPE weight AS ENUM ('primary','secondary','tertiary');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'confidence') THEN
    CREATE TYPE confidence AS ENUM ('verified','suggested','automatic');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'revision_type') THEN
    CREATE TYPE revision_type AS ENUM (
      'draft_save','review_submit','review_changes',
      'publish','archive','correction');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'review_requested','content_published','achievement_earned',
      'comment_received','mention','level_up',
      'content_flagged','review_decision');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'constellation_layer_type') THEN
    CREATE TYPE constellation_layer_type AS ENUM (
      'origins','foundational','constellation','traditions','modern');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relationship_type') THEN
    CREATE TYPE relationship_type AS ENUM (
      'influenced','disagreed','collaborated','teacher_student',
      'contemporary','responded_to','extended','opposed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seal_shape') THEN
    CREATE TYPE seal_shape AS ENUM ('circle','octagon','hexagon','diamond','compass');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seal_tier') THEN
    CREATE TYPE seal_tier AS ENUM ('slate','blue','silver','gold');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seal_category') THEN
    CREATE TYPE seal_category AS ENUM ('progression','domain','time','support');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seal_progress_status') THEN
    CREATE TYPE seal_progress_status AS ENUM ('locked','in_progress','earned');
  END IF;
END $$;

-- ===== EXTENSION =====
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ===== CORE TABLES =====
CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    varchar(255) UNIQUE NOT NULL,
  email       varchar(320) UNIQUE NOT NULL,
  role        role DEFAULT 'member' NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL,
  deleted_at  timestamptz
);

CREATE TABLE IF NOT EXISTS profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name varchar(100) NOT NULL,
  bio          varchar(280),
  avatar_url   varchar(512),
  reputation   integer DEFAULT 0 NOT NULL,
  level        integer DEFAULT 1 NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS objects (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type    varchar(50) NOT NULL,
  slug           varchar(200) UNIQUE NOT NULL,
  title          varchar(500) NOT NULL,
  status         content_state DEFAULT 'draft' NOT NULL,
  visibility     varchar(20) DEFAULT 'public' NOT NULL,
  language       language DEFAULT 'th' NOT NULL,
  difficulty     difficulty DEFAULT 'intermediate' NOT NULL,
  description    varchar(280) NOT NULL,
  aliases        text[],
  domains        varchar(100)[],
  tags           varchar(50)[],
  thumbnail      varchar(512),
  reading_time   integer,
  word_count     integer,
  view_count     integer DEFAULT 0 NOT NULL,
  backlink_count integer DEFAULT 0 NOT NULL,
  version        integer DEFAULT 1 NOT NULL,
  author_id      uuid REFERENCES users(id),
  editor_id      uuid REFERENCES users(id),
  search_vector  text,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL,
  published_at   timestamptz,
  deleted_at     timestamptz
);

-- ===== KNOWLEDGE TYPE TABLES =====
CREATE TABLE IF NOT EXISTS concepts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id      uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  definition     text,
  etymology      text,
  related_terms  text[],
  primary_domain varchar(100),
  is_core        boolean DEFAULT false NOT NULL,
  complexity     integer DEFAULT 1 NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS thinkers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id       uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  full_name       varchar(200) NOT NULL,
  birth_date      varchar(20),
  death_date      varchar(20),
  nationality     varchar(100),
  era             varchar(100),
  bio             text,
  portrait_url    varchar(512),
  is_highlighted  boolean DEFAULT false NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id    uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  isbn         varchar(20),
  publisher    varchar(200),
  publish_year integer,
  edition      varchar(100),
  page_count   integer,
  cover_url    varchar(512),
  language     language DEFAULT 'th' NOT NULL,
  is_primary   boolean DEFAULT false NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id    uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  body         text,
  excerpt      text,
  footnotes    jsonb,
  is_longform  boolean DEFAULT false NOT NULL,
  difficulty   difficulty DEFAULT 'intermediate' NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS theories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id       uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  statement       text,
  principles      text[],
  applications    text[],
  is_foundational boolean DEFAULT false NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS schools (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id    uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  period       varchar(100),
  location     varchar(200),
  methodology  text,
  key_thinkers uuid[],
  is_active    boolean DEFAULT false NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS disciplines (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id  uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  scope      text,
  subfields  text[],
  parent_id  uuid,
  depth      integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS symbols (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id        uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  meaning          text,
  archetype        varchar(100),
  cultural_context text,
  image_url        varchar(512),
  is_universal     boolean DEFAULT false NOT NULL,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id      uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  text           text NOT NULL,
  speaker_id     uuid REFERENCES objects(id),
  source_id      uuid REFERENCES objects(id),
  page_number    integer,
  context        text,
  is_highlighted boolean DEFAULT false NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id   uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  event_date  varchar(50) NOT NULL,
  end_date    varchar(50),
  location    varchar(200),
  significance text,
  is_major    boolean DEFAULT false NOT NULL,
  precision   varchar(20) DEFAULT 'year' NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- ===== Part 01 END — ต่อด้วย Part 02 =====
