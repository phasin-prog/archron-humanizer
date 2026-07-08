-- ============================================================
-- ARCHRON — Part 03/06: Schema — Constellation + Seals + Triggers + Indexes
-- DB = Supabase (PostgreSQL)
-- ------------------------------------------------------------
-- ต้องรันหลัง Part 01 + 02
-- สร้าง: constellation tables + seals/reading + ALTER extensions
--         + 6 trigger functions + 24 triggers + 70+ indexes
-- Idempotent
-- ============================================================

-- ===== CONSTELLATION SYSTEM =====
CREATE TABLE IF NOT EXISTS domains (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        varchar(100) UNIQUE NOT NULL,
  name        varchar(200) NOT NULL,
  name_th     varchar(200),
  description text,
  color       varchar(7) NOT NULL,
  icon        varchar(50),
  sort_order  integer NOT NULL,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS constellation_layers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        varchar(50) UNIQUE NOT NULL,
  name        varchar(200) NOT NULL,
  name_th     varchar(200),
  description text,
  sequence    integer NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS constellations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id       uuid NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name            varchar(300) NOT NULL,
  name_th         varchar(300),
  description     text,
  time_period     varchar(100),
  central_question text,
  layer_id        uuid REFERENCES constellation_layers(id) ON DELETE SET NULL,
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS thinker_domains (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_id uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  domain_id  uuid NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  contribution text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(thinker_id, domain_id)
);

CREATE TABLE IF NOT EXISTS thinker_relationships (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_thinker_id  uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  target_thinker_id  uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  relationship_type  varchar(50) NOT NULL,
  description        text,
  weight             integer DEFAULT 1,
  confidence         varchar(20) DEFAULT 'suggested',
  created_at         timestamptz DEFAULT now() NOT NULL,
  updated_at         timestamptz DEFAULT now() NOT NULL,
  CHECK (source_thinker_id <> target_thinker_id)
);

CREATE TABLE IF NOT EXISTS traditions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           varchar(100) UNIQUE NOT NULL,
  name           varchar(200) NOT NULL,
  name_th        varchar(200),
  description    text,
  domain_id      uuid REFERENCES domains(id) ON DELETE SET NULL,
  time_period    varchar(100),
  key_principles text[],
  founder_ids    uuid[],
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS thinker_traditions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_id  uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  tradition_id uuid NOT NULL REFERENCES traditions(id) ON DELETE CASCADE,
  role        varchar(50),
  contribution text,
  created_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE(thinker_id, tradition_id)
);

-- ===== SEALS & READING =====
CREATE TABLE IF NOT EXISTS academic_seals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        varchar(100) UNIQUE NOT NULL,
  name        varchar(200) NOT NULL,
  name_th     varchar(200),
  description text NOT NULL,
  requirement text NOT NULL,
  symbol      text NOT NULL,
  shape       seal_shape NOT NULL,
  color       varchar(7) NOT NULL,
  tier        seal_tier NOT NULL,
  level       integer,
  category    seal_category NOT NULL,
  domain_id   uuid REFERENCES domains(id) ON DELETE SET NULL,
  criteria    jsonb NOT NULL,
  sort_order  integer DEFAULT 0,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_seals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seal_id       uuid NOT NULL REFERENCES academic_seals(id) ON DELETE CASCADE,
  earned_at     timestamptz DEFAULT now() NOT NULL,
  is_displayed  boolean DEFAULT true,
  display_order integer DEFAULT 0,
  metadata      jsonb,
  UNIQUE(user_id, seal_id)
);

CREATE TABLE IF NOT EXISTS seal_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seal_id         uuid NOT NULL REFERENCES academic_seals(id) ON DELETE CASCADE,
  current_value    integer DEFAULT 0 NOT NULL,
  target_value     integer NOT NULL,
  progress_percent integer DEFAULT 0,
  status          seal_progress_status DEFAULT 'locked',
  progress_data   jsonb,
  last_updated_at timestamptz DEFAULT now(),
  created_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, seal_id)
);

CREATE TABLE IF NOT EXISTS reading_activities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  object_id     uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  object_type   varchar(50) NOT NULL,
  domain        varchar(100),
  read_at       timestamptz DEFAULT now() NOT NULL,
  is_completed  boolean DEFAULT false,
  read_duration integer,
  UNIQUE(user_id, object_id)
);

-- ===== EXTENDED COLUMNS (idempotent) =====
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='primary_domain_id') THEN
    ALTER TABLE thinkers ADD COLUMN primary_domain_id uuid REFERENCES domains(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='constellation_id') THEN
    ALTER TABLE thinkers ADD COLUMN constellation_id uuid REFERENCES constellations(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='layer_id') THEN
    ALTER TABLE thinkers ADD COLUMN layer_id uuid REFERENCES constellation_layers(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='influence_score') THEN
    ALTER TABLE thinkers ADD COLUMN influence_score integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='time_period') THEN
    ALTER TABLE thinkers ADD COLUMN time_period varchar(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='primary_work') THEN
    ALTER TABLE thinkers ADD COLUMN primary_work text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='thinkers' AND column_name='key_concepts') THEN
    ALTER TABLE thinkers ADD COLUMN key_concepts text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='objects' AND column_name='read_count') THEN
    ALTER TABLE objects ADD COLUMN read_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='objects' AND column_name='unique_readers') THEN
    ALTER TABLE objects ADD COLUMN unique_readers integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='objects' AND column_name='last_read_at') THEN
    ALTER TABLE objects ADD COLUMN last_read_at timestamptz;
  END IF;
END $$;

-- ===== TRIGGER FUNCTIONS =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  obj_aliases text; obj_tags text;
BEGIN
  obj_aliases := CASE WHEN NEW.aliases IS NOT NULL THEN array_to_string(NEW.aliases, ' ') ELSE '' END;
  obj_tags    := CASE WHEN NEW.tags    IS NOT NULL THEN array_to_string(NEW.tags, ' ')    ELSE '' END;
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(obj_aliases, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(obj_tags, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION track_revision()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO revisions (object_id, user_id, revision_type, content_snapshot, change_summary, version)
    VALUES (
      NEW.id, NEW.editor_id,
      CASE
        WHEN NEW.status = 'published' AND OLD.status <> 'published' THEN 'publish'
        WHEN NEW.status = 'review'    AND OLD.status <> 'review'    THEN 'review_submit'
        WHEN NEW.status = 'archived'  AND OLD.status <> 'archived'  THEN 'archive'
        ELSE 'draft_save'
      END,
      NEW.description, 'Automated revision from trigger', NEW.version);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recalc_backlinks()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE objects SET backlink_count = backlink_count + 1 WHERE id = NEW.target_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE objects SET backlink_count = GREATEST(backlink_count - 1, 0) WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_graph_node()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO graph_nodes (object_id, label, node_type, position, influence_score, degree)
    VALUES (NEW.id, NEW.title, NEW.object_type, '{"x": 0, "y": 0}'::jsonb, 0, 0);
  ELSIF (TG_OP = 'UPDATE' AND OLD.title IS DISTINCT FROM NEW.title) THEN
    UPDATE graph_nodes SET label = NEW.title, updated_at = now() WHERE object_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_graph_edge()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO graph_edges (source_node_id, target_node_id, relationship_id, label, weight, direction)
    SELECT sgn.id, tgn.id, NEW.id, NEW.relation_type::text,
           CASE WHEN NEW.weight = 'primary' THEN 3 WHEN NEW.weight = 'secondary' THEN 2 ELSE 1 END,
           'directed'
    FROM graph_nodes sgn, graph_nodes tgn
    WHERE sgn.object_id = NEW.source_id AND tgn.object_id = NEW.target_id;
    UPDATE graph_nodes SET degree = degree + 1 WHERE object_id IN (NEW.source_id, NEW.target_id);
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE graph_nodes SET degree = GREATEST(degree - 1, 0) WHERE object_id IN (OLD.source_id, OLD.target_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGERS (DROP + CREATE) =====
DROP TRIGGER IF EXISTS trg_users_updated_at           ON users;
DROP TRIGGER IF EXISTS trg_profiles_updated_at        ON profiles;
DROP TRIGGER IF EXISTS trg_objects_updated_at         ON objects;
DROP TRIGGER IF EXISTS trg_concepts_updated_at        ON concepts;
DROP TRIGGER IF EXISTS trg_thinkers_updated_at        ON thinkers;
DROP TRIGGER IF EXISTS trg_books_updated_at           ON books;
DROP TRIGGER IF EXISTS trg_articles_updated_at        ON articles;
DROP TRIGGER IF EXISTS trg_theories_updated_at        ON theories;
DROP TRIGGER IF EXISTS trg_schools_updated_at         ON schools;
DROP TRIGGER IF EXISTS trg_disciplines_updated_at     ON disciplines;
DROP TRIGGER IF EXISTS trg_symbols_updated_at         ON symbols;
DROP TRIGGER IF EXISTS trg_quotes_updated_at          ON quotes;
DROP TRIGGER IF EXISTS trg_timeline_events_updated_at ON timeline_events;
DROP TRIGGER IF EXISTS trg_relationships_updated_at   ON relationships;
DROP TRIGGER IF EXISTS trg_graph_nodes_updated_at     ON graph_nodes;
DROP TRIGGER IF EXISTS trg_graph_edges_updated_at     ON graph_edges;
DROP TRIGGER IF EXISTS trg_collections_updated_at     ON collections;
DROP TRIGGER IF EXISTS trg_guides_updated_at          ON guides;
DROP TRIGGER IF EXISTS trg_guide_lessons_updated_at   ON guide_lessons;
DROP TRIGGER IF EXISTS trg_objects_search_vector      ON objects;
DROP TRIGGER IF EXISTS trg_objects_track_revision     ON objects;
DROP TRIGGER IF EXISTS trg_relationships_backlinks    ON relationships;
DROP TRIGGER IF EXISTS trg_objects_graph_node         ON objects;
DROP TRIGGER IF EXISTS trg_relationships_graph_edge   ON relationships;

CREATE TRIGGER trg_users_updated_at           BEFORE UPDATE ON users           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at        BEFORE UPDATE ON profiles        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_objects_updated_at         BEFORE UPDATE ON objects         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_concepts_updated_at        BEFORE UPDATE ON concepts        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_thinkers_updated_at        BEFORE UPDATE ON thinkers        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_books_updated_at           BEFORE UPDATE ON books           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_articles_updated_at        BEFORE UPDATE ON articles        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_theories_updated_at        BEFORE UPDATE ON theories        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_schools_updated_at         BEFORE UPDATE ON schools         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_disciplines_updated_at     BEFORE UPDATE ON disciplines     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_symbols_updated_at         BEFORE UPDATE ON symbols         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quotes_updated_at          BEFORE UPDATE ON quotes          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_timeline_events_updated_at BEFORE UPDATE ON timeline_events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_relationships_updated_at   BEFORE UPDATE ON relationships   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_graph_nodes_updated_at     BEFORE UPDATE ON graph_nodes     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_graph_edges_updated_at     BEFORE UPDATE ON graph_edges     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_collections_updated_at     BEFORE UPDATE ON collections     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_guides_updated_at          BEFORE UPDATE ON guides          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_guide_lessons_updated_at   BEFORE UPDATE ON guide_lessons   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_objects_search_vector      BEFORE INSERT OR UPDATE ON objects       FOR EACH ROW EXECUTE FUNCTION update_search_vector();
CREATE TRIGGER trg_objects_track_revision     AFTER  UPDATE ON objects                 FOR EACH ROW EXECUTE FUNCTION track_revision();
CREATE TRIGGER trg_relationships_backlinks    AFTER  INSERT OR DELETE ON relationships FOR EACH ROW EXECUTE FUNCTION recalc_backlinks();
CREATE TRIGGER trg_objects_graph_node         AFTER  INSERT OR UPDATE ON objects       FOR EACH ROW EXECUTE FUNCTION sync_graph_node();
CREATE TRIGGER trg_relationships_graph_edge   AFTER  INSERT OR DELETE ON relationships FOR EACH ROW EXECUTE FUNCTION sync_graph_edge();

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_objects_search_vector    ON objects USING GIN (to_tsvector('english', COALESCE(search_vector, '')));
CREATE INDEX IF NOT EXISTS idx_objects_slug_trgm        ON objects USING GIN (slug gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_objects_title_trgm       ON objects USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_objects_status_published ON objects (status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_objects_object_type      ON objects (object_type);
CREATE INDEX IF NOT EXISTS idx_objects_language         ON objects (language);
CREATE INDEX IF NOT EXISTS idx_objects_difficulty       ON objects (difficulty);
CREATE INDEX IF NOT EXISTS idx_objects_created_at       ON objects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_published_at     ON objects (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_author           ON objects (author_id);
CREATE INDEX IF NOT EXISTS idx_objects_combined         ON objects (object_type, status, language);
CREATE INDEX IF NOT EXISTS idx_objects_read_count       ON objects (read_count DESC);
CREATE INDEX IF NOT EXISTS idx_objects_unique_readers   ON objects (unique_readers DESC);
CREATE INDEX IF NOT EXISTS idx_concepts_object        ON concepts (object_id);
CREATE INDEX IF NOT EXISTS idx_thinkers_object        ON thinkers (object_id);
CREATE INDEX IF NOT EXISTS idx_thinkers_constellation ON thinkers (constellation_id);
CREATE INDEX IF NOT EXISTS idx_thinkers_layer         ON thinkers (layer_id);
CREATE INDEX IF NOT EXISTS idx_thinkers_primary_domain ON thinkers (primary_domain_id);
CREATE INDEX IF NOT EXISTS idx_thinkers_influence      ON thinkers (influence_score DESC);
CREATE INDEX IF NOT EXISTS idx_books_object            ON books (object_id);
CREATE INDEX IF NOT EXISTS idx_articles_object         ON articles (object_id);
CREATE INDEX IF NOT EXISTS idx_theories_object         ON theories (object_id);
CREATE INDEX IF NOT EXISTS idx_schools_object          ON schools (object_id);
CREATE INDEX IF NOT EXISTS idx_disciplines_object      ON disciplines (object_id);
CREATE INDEX IF NOT EXISTS idx_symbols_object          ON symbols (object_id);
CREATE INDEX IF NOT EXISTS idx_quotes_object           ON quotes (object_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_object  ON timeline_events (object_id);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships (source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships (target_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type   ON relationships (relation_type);
CREATE INDEX IF NOT EXISTS idx_relationships_pair   ON relationships (source_id, target_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_object   ON graph_nodes (object_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source   ON graph_edges (source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target   ON graph_edges (target_node_id);
CREATE INDEX IF NOT EXISTS idx_slugs_object          ON slugs (object_id);
CREATE INDEX IF NOT EXISTS idx_slug_redirects_old    ON slug_redirects (old_slug);
CREATE INDEX IF NOT EXISTS idx_aliases_object        ON aliases (object_id);
CREATE INDEX IF NOT EXISTS idx_revisions_object      ON revisions (object_id);
CREATE INDEX IF NOT EXISTS idx_revisions_user        ON revisions (user_id);
CREATE INDEX IF NOT EXISTS idx_search_index_object   ON search_index (object_id);
CREATE INDEX IF NOT EXISTS idx_object_references_object   ON object_references (object_id);
CREATE INDEX IF NOT EXISTS idx_object_references_reference ON object_references (reference_id);
CREATE INDEX IF NOT EXISTS idx_collections_owner          ON collections (owner_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items (collection_id);
CREATE INDEX IF NOT EXISTS idx_comments_object            ON comments (object_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user         ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread       ON notifications (user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_tags_name                  ON tags (name);
CREATE INDEX IF NOT EXISTS idx_object_tags_object         ON object_tags (object_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user  ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_clerk    ON users (clerk_id);
CREATE INDEX IF NOT EXISTS idx_domains_slug                ON domains (slug);
CREATE INDEX IF NOT EXISTS idx_domains_sort_order          ON domains (sort_order);
CREATE INDEX IF NOT EXISTS idx_constellation_layers_slug      ON constellation_layers (slug);
CREATE INDEX IF NOT EXISTS idx_constellation_layers_sequence  ON constellation_layers (sequence);
CREATE INDEX IF NOT EXISTS idx_constellations_domain       ON constellations (domain_id);
CREATE INDEX IF NOT EXISTS idx_constellations_layer        ON constellations (layer_id);
CREATE INDEX IF NOT EXISTS idx_constellations_sort         ON constellations (domain_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_thinker_domains_thinker     ON thinker_domains (thinker_id);
CREATE INDEX IF NOT EXISTS idx_thinker_domains_domain      ON thinker_domains (domain_id);
CREATE INDEX IF NOT EXISTS idx_thinker_rels_source         ON thinker_relationships (source_thinker_id);
CREATE INDEX IF NOT EXISTS idx_thinker_rels_target         ON thinker_relationships (target_thinker_id);
CREATE INDEX IF NOT EXISTS idx_thinker_rels_type           ON thinker_relationships (relationship_type);
CREATE INDEX IF NOT EXISTS idx_traditions_domain           ON traditions (domain_id);
CREATE INDEX IF NOT EXISTS idx_traditions_slug             ON traditions (slug);
CREATE INDEX IF NOT EXISTS idx_thinker_traditions_thinker  ON thinker_traditions (thinker_id);
CREATE INDEX IF NOT EXISTS idx_thinker_traditions_tradition ON thinker_traditions (tradition_id);
CREATE INDEX IF NOT EXISTS idx_seals_slug          ON academic_seals (slug);
CREATE INDEX IF NOT EXISTS idx_seals_category      ON academic_seals (category);
CREATE INDEX IF NOT EXISTS idx_seals_tier          ON academic_seals (tier);
CREATE INDEX IF NOT EXISTS idx_seals_level         ON academic_seals (level);
CREATE INDEX IF NOT EXISTS idx_seals_domain        ON academic_seals (domain_id);
CREATE INDEX IF NOT EXISTS idx_seals_sort          ON academic_seals (sort_order);
CREATE INDEX IF NOT EXISTS idx_user_seals_user     ON user_seals (user_id);
CREATE INDEX IF NOT EXISTS idx_user_seals_seal     ON user_seals (seal_id);
CREATE INDEX IF NOT EXISTS idx_seal_progress_user  ON seal_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_seal_progress_seal  ON seal_progress (seal_id);
CREATE INDEX IF NOT EXISTS idx_reading_user        ON reading_activities (user_id);
CREATE INDEX IF NOT EXISTS idx_reading_object      ON reading_activities (object_id);
CREATE INDEX IF NOT EXISTS idx_reading_domain      ON reading_activities (user_id, domain);
CREATE INDEX IF NOT EXISTS idx_reading_date        ON reading_activities (user_id, read_at DESC);

-- ===== Part 03 END — Schema ครบ ต่อด้วย Part 04 (queries) =====
