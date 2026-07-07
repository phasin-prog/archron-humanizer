-- GIN index for full-text search on objects
CREATE INDEX IF NOT EXISTS idx_objects_search_vector ON objects USING GIN (search_vector);

-- Trigram indexes for fuzzy search on slugs and titles
CREATE INDEX IF NOT EXISTS idx_objects_slug_trgm ON objects USING GIN (slug gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_objects_title_trgm ON objects USING GIN (title gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_objects_status_published ON objects (status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_objects_object_type ON objects (object_type);
CREATE INDEX IF NOT EXISTS idx_objects_language ON objects (language);
CREATE INDEX IF NOT EXISTS idx_objects_difficulty ON objects (difficulty);
CREATE INDEX IF NOT EXISTS idx_objects_created_at ON objects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_published_at ON objects (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_author ON objects (author_id);
CREATE INDEX IF NOT EXISTS idx_objects_combined ON objects (object_type, status, language);

-- Relationship indexes
CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships (source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships (target_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type ON relationships (relation_type);
CREATE INDEX IF NOT EXISTS idx_relationships_pair ON relationships (source_id, target_id);

-- Graph indexes
CREATE INDEX IF NOT EXISTS idx_graph_nodes_object ON graph_nodes (object_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges (source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges (target_node_id);

-- Knowledge table indexes
CREATE INDEX IF NOT EXISTS idx_concepts_object ON concepts (object_id);
CREATE INDEX IF NOT EXISTS idx_thinkers_object ON thinkers (object_id);
CREATE INDEX IF NOT EXISTS idx_books_object ON books (object_id);
CREATE INDEX IF NOT EXISTS idx_articles_object ON articles (object_id);
CREATE INDEX IF NOT EXISTS idx_theories_object ON theories (object_id);
CREATE INDEX IF NOT EXISTS idx_schools_object ON schools (object_id);
CREATE INDEX IF NOT EXISTS idx_disciplines_object ON disciplines (object_id);
CREATE INDEX IF NOT EXISTS idx_symbols_object ON symbols (object_id);
CREATE INDEX IF NOT EXISTS idx_quotes_object ON quotes (object_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_object ON timeline_events (object_id);

-- Social & content indexes
CREATE INDEX IF NOT EXISTS idx_collections_owner ON collections (owner_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items (collection_id);
CREATE INDEX IF NOT EXISTS idx_comments_object ON comments (object_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags (name);
CREATE INDEX IF NOT EXISTS idx_object_tags_object ON object_tags (object_id);

-- Slug indexes
CREATE INDEX IF NOT EXISTS idx_slugs_object ON slugs (object_id);
CREATE INDEX IF NOT EXISTS idx_slug_redirects_old ON slug_redirects (old_slug);
CREATE INDEX IF NOT EXISTS idx_aliases_object ON aliases (object_id);

-- Revision indexes
CREATE INDEX IF NOT EXISTS idx_revisions_object ON revisions (object_id);
CREATE INDEX IF NOT EXISTS idx_revisions_user ON revisions (user_id);

-- User profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_clerk ON users (clerk_id);

-- Search index indexes
CREATE INDEX IF NOT EXISTS idx_search_index_object ON search_index (object_id);
CREATE INDEX IF NOT EXISTS idx_search_index_vector ON search_index USING GIN (to_tsvector('english', COALESCE(searchable_text, '')));

-- Reference indexes
CREATE INDEX IF NOT EXISTS idx_object_references_object ON object_references (object_id);
CREATE INDEX IF NOT EXISTS idx_object_references_reference ON object_references (reference_id);
