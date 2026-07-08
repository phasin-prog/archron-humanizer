-- ============================================================
-- ARCHRON — Part 04/06: Queries — Inventory + Core + Knowledge + Constellation + Graph
-- DB = Supabase (PostgreSQL)
-- ------------------------------------------------------------
-- ต้องรัน Part 01-03 ก่อน (สร้าง schema)
-- แล้วไฟล์นี้รันได้ทันที — ทุก query ส่งออกเนื้อหา
-- ============================================================

-- ===== §1  INVENTORY — นับจำนวนแถวทุกตาราง =====
SELECT 'objects'              AS table_name, count(*) FROM objects
UNION ALL SELECT 'concepts',            count(*) FROM concepts
UNION ALL SELECT 'thinkers',            count(*) FROM thinkers
UNION ALL SELECT 'books',               count(*) FROM books
UNION ALL SELECT 'articles',           count(*) FROM articles
UNION ALL SELECT 'theories',            count(*) FROM theories
UNION ALL SELECT 'schools',             count(*) FROM schools
UNION ALL SELECT 'disciplines',         count(*) FROM disciplines
UNION ALL SELECT 'symbols',             count(*) FROM symbols
UNION ALL SELECT 'quotes',              count(*) FROM quotes
UNION ALL SELECT 'timeline_events',     count(*) FROM timeline_events
UNION ALL SELECT 'relationships',       count(*) FROM relationships
UNION ALL SELECT 'graph_nodes',         count(*) FROM graph_nodes
UNION ALL SELECT 'graph_edges',         count(*) FROM graph_edges
UNION ALL SELECT 'slugs',               count(*) FROM slugs
UNION ALL SELECT 'slug_redirects',      count(*) FROM slug_redirects
UNION ALL SELECT 'aliases',             count(*) FROM aliases
UNION ALL SELECT 'revisions',           count(*) FROM revisions
UNION ALL SELECT 'search_index',        count(*) FROM search_index
UNION ALL SELECT 'references',          count(*) FROM "references"
UNION ALL SELECT 'object_references',   count(*) FROM object_references
UNION ALL SELECT 'domains',             count(*) FROM domains
UNION ALL SELECT 'constellation_layers',count(*) FROM constellation_layers
UNION ALL SELECT 'constellations',      count(*) FROM constellations
UNION ALL SELECT 'thinker_domains',     count(*) FROM thinker_domains
UNION ALL SELECT 'thinker_relationships',count(*) FROM thinker_relationships
UNION ALL SELECT 'traditions',          count(*) FROM traditions
UNION ALL SELECT 'thinker_traditions',  count(*) FROM thinker_traditions
UNION ALL SELECT 'collections',         count(*) FROM collections
UNION ALL SELECT 'collection_items',    count(*) FROM collection_items
UNION ALL SELECT 'guides',               count(*) FROM guides
UNION ALL SELECT 'guide_lessons',        count(*) FROM guide_lessons
UNION ALL SELECT 'academic_seals',      count(*) FROM academic_seals
UNION ALL SELECT 'user_seals',           count(*) FROM user_seals
UNION ALL SELECT 'seal_progress',       count(*) FROM seal_progress
UNION ALL SELECT 'reading_activities',   count(*) FROM reading_activities
UNION ALL SELECT 'achievements',         count(*) FROM achievements
UNION ALL SELECT 'user_achievements',    count(*) FROM user_achievements
UNION ALL SELECT 'reputation_events',   count(*) FROM reputation_events
UNION ALL SELECT 'drafts',              count(*) FROM drafts
UNION ALL SELECT 'comments',            count(*) FROM comments
UNION ALL SELECT 'media',               count(*) FROM media
UNION ALL SELECT 'tags',                count(*) FROM tags
UNION ALL SELECT 'object_tags',          count(*) FROM object_tags
UNION ALL SELECT 'notifications',        count(*) FROM notifications
UNION ALL SELECT 'users',               count(*) FROM users
UNION ALL SELECT 'profiles',            count(*) FROM profiles
ORDER BY table_name;


-- ===== §2  CORE CONTENT — objects (ตารางหลัก) =====
SELECT
  o.id, o.object_type, o.slug, o.title, o.status, o.visibility, o.language, o.difficulty,
  o.description, o.aliases, o.domains, o.tags, o.thumbnail,
  o.reading_time, o.word_count, o.view_count, o.read_count, o.unique_readers,
  o.backlink_count, o.version, o.author_id, o.editor_id,
  o.published_at, o.created_at, o.updated_at, o.last_read_at, o.deleted_at
FROM objects o
WHERE o.deleted_at IS NULL
ORDER BY o.object_type, o.published_at DESC NULLS LAST, o.created_at DESC;


-- ===== §3  KNOWLEDGE TYPE-SPECIFIC TABLES =====

-- §3.1 Concepts
SELECT o.slug, o.title, o.status, c.*
FROM concepts c
JOIN objects o ON c.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY c.is_core DESC, o.title;

-- §3.2 Thinkers (รวมฟิลด์ Constellation)
SELECT
  o.slug, o.title, o.status,
  t.full_name, t.birth_date, t.death_date, t.nationality, t.era,
  t.bio, t.portrait_url, t.is_highlighted,
  t.primary_domain_id, t.constellation_id, t.layer_id,
  t.influence_score, t.time_period, t.primary_work, t.key_concepts
FROM thinkers t
JOIN objects o ON t.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY t.is_highlighted DESC, t.influence_score DESC NULLS LAST, t.full_name;

-- §3.3 Books
SELECT o.slug, o.title, o.status, b.*
FROM books b
JOIN objects o ON b.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY b.publish_year DESC NULLS LAST;

-- §3.4 Articles
SELECT o.slug, o.title, o.status, a.excerpt, a.body, a.footnotes, a.is_longform, a.difficulty, a.created_at
FROM articles a
JOIN objects o ON a.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- §3.5 Theories
SELECT o.slug, o.title, o.status, t.statement, t.principles, t.applications, t.is_foundational
FROM theories t
JOIN objects o ON t.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY t.is_foundational DESC, o.title;

-- §3.6 Schools
SELECT o.slug, o.title, o.status, s.period, s.location, s.methodology, s.key_thinkers, s.is_active
FROM schools s
JOIN objects o ON s.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY o.title;

-- §3.7 Disciplines
SELECT o.slug, o.title, d.scope, d.subfields, d.parent_id, d.depth
FROM disciplines d
JOIN objects o ON d.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY d.depth, o.title;

-- §3.8 Symbols
SELECT o.slug, o.title, s.meaning, s.archetype, s.cultural_context, s.image_url, s.is_universal
FROM symbols s
JOIN objects o ON s.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY o.title;

-- §3.9 Quotes (join speaker/source objects)
SELECT
  o.slug, o.title, q.text, q.context, q.page_number, q.is_highlighted,
  so.slug  AS speaker_slug,  so.title AS speaker_name,
  src.slug AS source_slug,    src.title AS source_title
FROM quotes q
JOIN objects o   ON q.object_id  = o.id
LEFT JOIN objects so  ON q.speaker_id = so.id
LEFT JOIN objects src ON q.source_id  = src.id
WHERE o.deleted_at IS NULL
ORDER BY q.is_highlighted DESC, o.created_at DESC;

-- §3.10 Timeline events
SELECT o.slug, o.title, te.event_date, te.end_date, te.location, te.significance, te.is_major, te.precision
FROM timeline_events te
JOIN objects o ON te.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY te.event_date;


-- ===== §4  CONSTELLATION SYSTEM =====

-- §4.1 Domains
SELECT id, slug, name, name_th, description, color, icon, sort_order, is_active
FROM domains
ORDER BY sort_order;

-- §4.2 Constellation layers
SELECT id, slug, name, name_th, description, sequence
FROM constellation_layers
ORDER BY sequence;

-- §4.3 Constellations
SELECT
  c.id, c.name, c.name_th, c.description, c.time_period, c.central_question, c.sort_order,
  d.slug AS domain_slug, d.name AS domain_name,
  l.slug AS layer_slug,  l.name AS layer_name
FROM constellations c
JOIN domains d              ON c.domain_id = d.id
LEFT JOIN constellation_layers l ON c.layer_id = l.id
ORDER BY d.sort_order, c.sort_order;

-- §4.4 Thinker ↔ Domain
SELECT
  td.id, td.is_primary, td.contribution,
  t.full_name, d.slug AS domain_slug, d.name AS domain_name
FROM thinker_domains td
JOIN thinkers t ON td.thinker_id = t.id
JOIN domains d   ON td.domain_id = d.id
ORDER BY d.sort_order, td.is_primary DESC, t.full_name;

-- §4.5 Thinker ↔ Thinker relationships
SELECT
  tr.id, tr.relationship_type, tr.description, tr.weight, tr.confidence,
  src.full_name AS source_thinker,
  tgt.full_name AS target_thinker
FROM thinker_relationships tr
JOIN thinkers src ON tr.source_thinker_id = src.id
JOIN thinkers tgt ON tr.target_thinker_id = tgt.id
ORDER BY tr.weight DESC, src.full_name;

-- §4.6 Traditions
SELECT
  tr.id, tr.slug, tr.name, tr.name_th, tr.description, tr.time_period,
  tr.key_principles, tr.founder_ids,
  d.slug AS domain_slug, d.name AS domain_name
FROM traditions tr
LEFT JOIN domains d ON tr.domain_id = d.id
ORDER BY tr.name;

-- §4.7 Thinker ↔ Tradition
SELECT
  tt.id, tt.role, tt.contribution,
  t.full_name, tr.slug AS tradition_slug, tr.name AS tradition_name
FROM thinker_traditions tt
JOIN thinkers t    ON tt.thinker_id = t.id
JOIN traditions tr ON tt.tradition_id = tr.id
ORDER BY tr.name, tt.role, t.full_name;


-- ===== §5  RELATIONSHIPS & KNOWLEDGE GRAPH =====

-- §5.1 Relationships
SELECT
  r.id, r.relation_type, r.weight, r.confidence, r.metadata, r.created_at,
  src.slug AS source_slug, src.title AS source_title,
  tgt.slug AS target_slug, tgt.title AS target_title
FROM relationships r
JOIN objects src ON r.source_id = src.id
JOIN objects tgt ON r.target_id = tgt.id
ORDER BY r.created_at DESC;

-- §5.2 Graph nodes
SELECT gn.id, gn.label, gn.node_type, gn.position, gn.influence_score, gn.degree,
       o.slug, o.status
FROM graph_nodes gn
JOIN objects o ON gn.object_id = o.id
ORDER BY gn.degree DESC, gn.influence_score DESC;

-- §5.3 Graph edges
SELECT
  ge.id, ge.label, ge.weight, ge.direction, ge.created_at,
  sn.label AS source_node, tn.label AS target_node,
  o.slug   AS source_slug, o2.slug AS target_slug
FROM graph_edges ge
JOIN graph_nodes sn ON ge.source_node_id = sn.id
JOIN graph_nodes tn ON ge.target_node_id = tn.id
LEFT JOIN objects o  ON sn.object_id = o.id
LEFT JOIN objects o2 ON tn.object_id = o2.id
ORDER BY ge.weight DESC, ge.created_at DESC;

-- ===== Part 04 END — ต่อด้วย Part 05 =====
