-- Register update_updated_at trigger on all tables with updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_objects_updated_at
  BEFORE UPDATE ON objects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_concepts_updated_at
  BEFORE UPDATE ON concepts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_thinkers_updated_at
  BEFORE UPDATE ON thinkers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_theories_updated_at
  BEFORE UPDATE ON theories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_disciplines_updated_at
  BEFORE UPDATE ON disciplines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_symbols_updated_at
  BEFORE UPDATE ON symbols
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_relationships_updated_at
  BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_graph_nodes_updated_at
  BEFORE UPDATE ON graph_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_graph_edges_updated_at
  BEFORE UPDATE ON graph_edges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_guide_lessons_updated_at
  BEFORE UPDATE ON guide_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Register update_search_vector trigger on objects
CREATE TRIGGER trg_objects_search_vector
  BEFORE INSERT OR UPDATE ON objects
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Register track_revision trigger on objects
CREATE TRIGGER trg_objects_track_revision
  AFTER UPDATE ON objects
  FOR EACH ROW EXECUTE FUNCTION track_revision();

-- Register recalc_backlinks trigger on relationships
CREATE TRIGGER trg_relationships_backlinks
  AFTER INSERT OR DELETE ON relationships
  FOR EACH ROW EXECUTE FUNCTION recalc_backlinks();

-- Register sync_graph_node trigger on objects
CREATE TRIGGER trg_objects_graph_node
  AFTER INSERT OR UPDATE ON objects
  FOR EACH ROW EXECUTE FUNCTION sync_graph_node();

-- Register sync_graph_edge trigger on relationships
CREATE TRIGGER trg_relationships_graph_edge
  AFTER INSERT OR DELETE ON relationships
  FOR EACH ROW EXECUTE FUNCTION sync_graph_edge();
