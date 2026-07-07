-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Update search vector from object content
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  obj_title text;
  obj_desc text;
  obj_aliases text;
  obj_tags text;
BEGIN
  SELECT COALESCE(NEW.title, ''), COALESCE(NEW.description, '') INTO obj_title, obj_desc;

  IF NEW.aliases IS NOT NULL THEN
    obj_aliases := array_to_string(NEW.aliases, ' ');
  ELSE
    obj_aliases := '';
  END IF;

  IF NEW.tags IS NOT NULL THEN
    obj_tags := array_to_string(NEW.tags, ' ');
  ELSE
    obj_tags := '';
  END IF;

  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(obj_title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(obj_desc, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(obj_aliases, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(obj_tags, '')), 'D');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Track object revisions
CREATE OR REPLACE FUNCTION track_revision()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO revisions (object_id, user_id, revision_type, content_snapshot, change_summary, version)
    VALUES (
      NEW.id,
      NEW.editor_id,
      CASE
        WHEN NEW.status = 'published' AND OLD.status <> 'published' THEN 'publish'
        WHEN NEW.status = 'review' AND OLD.status <> 'review' THEN 'review_submit'
        WHEN NEW.status = 'archived' AND OLD.status <> 'archived' THEN 'archive'
        ELSE 'draft_save'
      END,
      NEW.description,
      'Automated revision from trigger',
      NEW.version
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Recalculate backlinks
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

-- Function: Sync graph node when object is created or updated
CREATE OR REPLACE FUNCTION sync_graph_node()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO graph_nodes (object_id, label, node_type, position, influence_score, degree)
    VALUES (
      NEW.id,
      NEW.title,
      NEW.object_type,
      '{"x": 0, "y": 0}'::jsonb,
      0,
      0
    );
  ELSIF (TG_OP = 'UPDATE' AND OLD.title IS DISTINCT FROM NEW.title) THEN
    UPDATE graph_nodes SET label = NEW.title, updated_at = now() WHERE object_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Sync graph edge when relationship is created or deleted
CREATE OR REPLACE FUNCTION sync_graph_edge()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO graph_edges (source_node_id, target_node_id, relationship_id, label, weight, direction)
    SELECT
      sgn.id,
      tgn.id,
      NEW.id,
      NEW.relation_type::text,
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
