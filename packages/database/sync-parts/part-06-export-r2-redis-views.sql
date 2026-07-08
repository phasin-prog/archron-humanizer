-- ============================================================
-- ARCHRON — Part 06/06: Export + R2 + Redis + Views
-- DB = Supabase  |  Storage = Cloudflare R2  |  Cache = Upstash Redis
-- ------------------------------------------------------------
-- ต้องรัน Part 01-03 ก่อน (สร้าง schema)
-- ไฟล์นี้: unified export + R2 manifest + Redis payload + helper views
-- ============================================================

-- ===== §11  UNIFIED CONTENT EXPORT (big JOIN) =====
SELECT
  o.id, o.object_type, o.slug, o.title, o.status, o.visibility, o.language, o.difficulty,
  o.description, o.aliases, o.domains, o.tags, o.thumbnail,
  o.reading_time, o.word_count, o.view_count, o.read_count, o.unique_readers,
  o.backlink_count, o.version, o.published_at, o.created_at, o.updated_at,
  au.email  AS author_email,
  ap.display_name AS author_name,
  eu.email  AS editor_email,
  ep.display_name AS editor_name,
  c.definition        AS concept_definition,
  c.etymology         AS concept_etymology,
  c.related_terms     AS concept_related_terms,
  c.primary_domain    AS concept_primary_domain,
  c.is_core           AS concept_is_core,
  c.complexity        AS concept_complexity,
  t.full_name         AS thinker_full_name,
  t.nationality       AS thinker_nationality,
  t.era               AS thinker_era,
  t.influence_score   AS thinker_influence_score,
  t.time_period       AS thinker_time_period,
  t.primary_work      AS thinker_primary_work,
  t.key_concepts      AS thinker_key_concepts,
  b.isbn              AS book_isbn,
  b.publisher         AS book_publisher,
  b.publish_year      AS book_publish_year,
  b.page_count        AS book_page_count,
  a.excerpt           AS article_excerpt,
  a.body              AS article_body,
  a.is_longform       AS article_is_longform,
  th.statement        AS theory_statement,
  th.principles       AS theory_principles,
  th.applications     AS theory_applications,
  sc.period           AS school_period,
  sc.methodology      AS school_methodology,
  sy.meaning          AS symbol_meaning,
  sy.archetype        AS symbol_archetype,
  q.text              AS quote_text,
  te.event_date       AS timeline_event_date,
  te.significance     AS timeline_significance,
  tag_agg.tags,
  slug_agg.slugs,
  alias_agg.aliases
FROM objects o
LEFT JOIN users  au ON o.author_id = au.id
LEFT JOIN profiles ap ON ap.user_id = au.id
LEFT JOIN users  eu ON o.editor_id = eu.id
LEFT JOIN profiles ep ON ep.user_id = eu.id
LEFT JOIN concepts c       ON c.object_id = o.id
LEFT JOIN thinkers t       ON t.object_id = o.id
LEFT JOIN books b          ON b.object_id = o.id
LEFT JOIN articles a       ON a.object_id = o.id
LEFT JOIN theories th      ON th.object_id = o.id
LEFT JOIN schools sc       ON sc.object_id = o.id
LEFT JOIN symbols sy       ON sy.object_id = o.id
LEFT JOIN quotes q         ON q.object_id = o.id
LEFT JOIN timeline_events te ON te.object_id = o.id
LEFT JOIN LATERAL (
  SELECT array_agg(tg.name ORDER BY tg.name) AS tags
  FROM object_tags ot JOIN tags tg ON ot.tag_id = tg.id
  WHERE ot.object_id = o.id
) tag_agg ON true
LEFT JOIN LATERAL (
  SELECT array_agg(s.slug || ':' || s.locale ORDER BY s.is_active DESC) AS slugs
  FROM slugs s WHERE s.object_id = o.id
) slug_agg ON true
LEFT JOIN LATERAL (
  SELECT array_agg(al.name ORDER BY al.is_primary DESC) AS aliases
  FROM aliases al WHERE al.object_id = o.id
) alias_agg ON true
WHERE o.deleted_at IS NULL
ORDER BY o.object_type, o.published_at DESC NULLS LAST, o.created_at DESC;


-- ===== §12  R2 STORAGE ASSET MANIFEST =====
SELECT
  asset.*,
  CASE
    WHEN asset.url ~ '^https?://.*(r2\.cloudflarestorage\.com|pub-.*r2\.dev|assets\.archron\.app)'
      THEN 'r2'
    WHEN asset.url ~ '^https?://' THEN 'external'
    WHEN asset.url IS NULL OR asset.url = '' THEN 'missing'
    ELSE 'relative'
  END AS url_kind
FROM (
  SELECT 'media'            AS source_table, m.id AS source_id, m.object_id,
         m.url AS url,      m.thumbnail_url AS secondary_url, m.filename, m.mime_type
  FROM media m
  UNION ALL
  SELECT 'media_thumbnail', m.id, m.object_id, m.thumbnail_url, NULL, m.filename, m.mime_type
  FROM media m WHERE m.thumbnail_url IS NOT NULL
  UNION ALL
  SELECT 'object_thumbnail', o.id, o.id, o.thumbnail, NULL, o.title, NULL
  FROM objects o WHERE o.thumbnail IS NOT NULL
  UNION ALL
  SELECT 'thinker_portrait', t.id, t.object_id, t.portrait_url, NULL, t.full_name, NULL
  FROM thinkers t WHERE t.portrait_url IS NOT NULL
  UNION ALL
  SELECT 'book_cover', b.id, b.object_id, b.cover_url, NULL, NULL, NULL
  FROM books b WHERE b.cover_url IS NOT NULL
  UNION ALL
  SELECT 'symbol_image', s.id, s.object_id, s.image_url, NULL, NULL, NULL
  FROM symbols s WHERE s.image_url IS NOT NULL
  UNION ALL
  SELECT 'collection_cover', c.id, NULL, c.cover_url, NULL, c.name, NULL
  FROM collections c WHERE c.cover_url IS NOT NULL
  UNION ALL
  SELECT 'profile_avatar', p.id, p.user_id, p.avatar_url, NULL, p.display_name, NULL
  FROM profiles p WHERE p.avatar_url IS NOT NULL
) asset
ORDER BY url_kind, source_table;


-- ===== §13  UPSTASH REDIS CACHE PAYLOAD =====
SELECT
  ('obj:' || o.slug)                                    AS redis_key,
  jsonb_build_object(
    'id',           o.id,
    'type',         o.object_type,
    'slug',         o.slug,
    'title',        o.title,
    'status',       o.status,
    'language',    o.language,
    'difficulty',   o.difficulty,
    'description',  o.description,
    'aliases',      o.aliases,
    'domains',      o.domains,
    'tags',         o.tags,
    'thumbnail',    o.thumbnail,
    'readingTime',  o.reading_time,
    'wordCount',    o.word_count,
    'viewCount',    o.view_count,
    'backlinks',    o.backlink_count,
    'version',      o.version,
    'publishedAt',  o.published_at,
    'updatedAt',    o.updated_at,
    'relations',    rel_agg.relations,
    'backlinks',    bl_agg.backlink_objects,
    'slugs',        slug_agg.slugs,
    'aliasesList',  alias_agg.aliases,
    'tagsList',     tag_agg.tags
  ) AS redis_value
FROM objects o
LEFT JOIN LATERAL (
  SELECT jsonb_agg(jsonb_build_object(
    'type',   r.relation_type,
    'weight', r.weight,
    'target', t.slug,
    'title',  t.title
  ) ORDER BY r.created_at) AS relations
  FROM relationships r JOIN objects t ON r.target_id = t.id
  WHERE r.source_id = o.id
) rel_agg ON true
LEFT JOIN LATERAL (
  SELECT jsonb_agg(jsonb_build_object(
    'type',   r.relation_type,
    'source', s.slug,
    'title',  s.title
  ) ORDER BY r.created_at) AS backlink_objects
  FROM relationships r JOIN objects s ON r.source_id = s.id
  WHERE r.target_id = o.id
) bl_agg ON true
LEFT JOIN LATERAL (
  SELECT jsonb_agg(jsonb_build_object(
    'slug', s.slug, 'locale', s.locale, 'active', s.is_active
  )) AS slugs
  FROM slugs s WHERE s.object_id = o.id
) slug_agg ON true
LEFT JOIN LATERAL (
  SELECT jsonb_agg(jsonb_build_object(
    'name', a.name, 'type', a.alias_type, 'primary', a.is_primary
  )) AS aliases
  FROM aliases a WHERE a.object_id = o.id
) alias_agg ON true
LEFT JOIN LATERAL (
  SELECT array_agg(tg.name ORDER BY tg.name) AS tags
  FROM object_tags ot JOIN tags tg ON ot.tag_id = tg.id
  WHERE ot.object_id = o.id
) tag_agg ON true
WHERE o.deleted_at IS NULL AND o.status = 'published'
ORDER BY o.object_type, o.published_at DESC NULLS LAST;


-- ===== §14  OPTIONAL HELPER VIEWS =====
CREATE OR REPLACE VIEW v_published_content AS
SELECT o.id, o.object_type, o.slug, o.title, o.status, o.language, o.difficulty,
       o.description, o.tags, o.thumbnail, o.reading_time, o.word_count,
       o.view_count, o.backlink_count, o.published_at, o.updated_at
FROM objects o
WHERE o.deleted_at IS NULL AND o.status = 'published';

CREATE OR REPLACE VIEW v_r2_assets AS
SELECT 'media' AS source_table, m.id AS source_id, m.object_id,
       m.url AS url, m.thumbnail_url AS secondary_url, m.filename, m.mime_type
FROM media m
WHERE m.url IS NOT NULL
UNION ALL
SELECT 'object_thumbnail', o.id, o.id, o.thumbnail, NULL::text, o.title, NULL::text
FROM objects o
WHERE o.thumbnail IS NOT NULL AND o.deleted_at IS NULL
UNION ALL
SELECT 'thinker_portrait', t.id, t.object_id, t.portrait_url, NULL::text, t.full_name, NULL::text
FROM thinkers t
WHERE t.portrait_url IS NOT NULL
UNION ALL
SELECT 'book_cover', b.id, b.object_id, b.cover_url, NULL::text, NULL::text, NULL::text
FROM books b
WHERE b.cover_url IS NOT NULL
UNION ALL
SELECT 'symbol_image', s.id, s.object_id, s.image_url, NULL::text, NULL::text, NULL::text
FROM symbols s
WHERE s.image_url IS NOT NULL;

CREATE OR REPLACE VIEW v_redis_cache_payload AS
SELECT
  o.slug,
  jsonb_build_object(
    'id', o.id, 'type', o.object_type, 'slug', o.slug, 'title', o.title,
    'status', o.status, 'description', o.description,
    'tags', o.tags, 'viewCount', o.view_count, 'backlinks', o.backlink_count,
    'publishedAt', o.published_at, 'updatedAt', o.updated_at
  ) AS payload
FROM objects o
WHERE o.deleted_at IS NULL AND o.status = 'published';

-- ตัวอย่างการใช้ view:
--   SELECT * FROM v_published_content ORDER BY view_count DESC LIMIT 50;
--   SELECT * FROM v_r2_assets WHERE url NOT LIKE '%r2%';
--   SELECT * FROM v_redis_cache_payload WHERE slug = 'unconscious';

-- ===== Part 06 END — ครบทั้ง 6 ไฟล์ =====
