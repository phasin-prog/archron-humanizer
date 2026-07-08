-- ============================================================
-- ARCHRON — Part 05/06: Queries — Infrastructure + Social + Seals + Content + Users
-- DB = Supabase (PostgreSQL)
-- ------------------------------------------------------------
-- ต้องรัน Part 01-03 ก่อน (สร้าง schema)
-- ============================================================

-- ===== §6  INFRASTRUCTURE =====

-- §6.1 Active slugs
SELECT s.id, s.slug, s.locale, s.is_active, o.object_type, o.title
FROM slugs s
JOIN objects o ON s.object_id = o.id
WHERE s.is_active = true AND o.deleted_at IS NULL
ORDER BY o.object_type, s.slug;

-- §6.2 Slug redirects
SELECT sr.id, sr.old_slug, sr.new_slug, sr.redirect_type, o.title AS object_title
FROM slug_redirects sr
LEFT JOIN objects o ON sr.object_id = o.id
ORDER BY sr.created_at DESC;

-- §6.3 Aliases
SELECT a.id, a.name, a.alias_type, a.language, a.is_primary, o.slug, o.title
FROM aliases a
JOIN objects o ON a.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY a.is_primary DESC, a.name;

-- §6.4 Revisions
SELECT
  rv.id, rv.revision_type, rv.version, rv.change_summary, rv.created_at,
  o.slug, o.title,
  u.email AS editor_email
FROM revisions rv
JOIN objects o ON rv.object_id = o.id
LEFT JOIN users u ON rv.user_id = u.id
ORDER BY rv.created_at DESC;

-- §6.5 Search index
SELECT si.id, si.content_type, si.rank, si.searchable_text, o.slug, o.title
FROM search_index si
JOIN objects o ON si.object_id = o.id
WHERE o.deleted_at IS NULL
ORDER BY si.rank DESC, o.title;

-- §6.6 References
SELECT id, title, authors, source, url, doi, publish_year, citation_format, full_citation
FROM "references"
ORDER BY publish_year DESC NULLS LAST, title;

-- §6.7 Object ↔ Reference
SELECT
  orf.id, orf.context, orf.page_number, orf.confidence, orf.created_at,
  o.slug AS object_slug, o.title AS object_title,
  r.title AS reference_title, r.full_citation
FROM object_references orf
JOIN objects o        ON orf.object_id   = o.id
JOIN "references" r   ON orf.reference_id = r.id
ORDER BY orf.created_at DESC;


-- ===== §7  SOCIAL =====

-- §7.1 Collections
SELECT
  c.id, c.name, c.description, c.is_public, c.is_pinned, c.item_count, c.cover_url, c.created_at,
  u.email AS owner_email, p.display_name AS owner_name
FROM collections c
JOIN users u        ON c.owner_id = u.id
LEFT JOIN profiles p ON u.id = p.user_id
ORDER BY c.is_pinned DESC, c.created_at DESC;

-- §7.2 Collection items
SELECT
  ci.id, ci.notes, ci.sort_order, ci.added_at,
  col.name AS collection_name,
  o.slug AS object_slug, o.title AS object_title, o.object_type
FROM collection_items ci
JOIN collections col ON ci.collection_id = col.id
JOIN objects o        ON ci.object_id     = o.id
ORDER BY col.name, ci.sort_order;

-- §7.3 Guides
SELECT
  g.id, g.title, g.description, g.estimated_hours, g.is_published,
  g.lesson_count, g.enrollment_count, g.created_at,
  u.email AS creator_email
FROM guides g
JOIN users u ON g.creator_id = u.id
ORDER BY g.is_published DESC, g.created_at DESC;

-- §7.4 Guide lessons
SELECT
  gl.id, gl.title, gl.content, gl.object_refs, gl.sequence, gl.estimated_minutes, gl.is_optional,
  g.title AS guide_title
FROM guide_lessons gl
JOIN guides g ON gl.guide_id = g.id
ORDER BY g.title, gl.sequence;


-- ===== §8  SEALS & READING =====

-- §8.1 Academic seals catalog
SELECT
  s.id, s.slug, s.name, s.name_th, s.description, s.requirement,
  s.symbol, s.shape, s.color, s.tier, s.level, s.category,
  s.criteria, s.sort_order, s.is_active,
  d.slug AS domain_slug, d.name AS domain_name
FROM academic_seals s
LEFT JOIN domains d ON s.domain_id = d.id
ORDER BY s.sort_order, s.level NULLS LAST;

-- §8.2 User seals
SELECT
  us.id, us.earned_at, us.is_displayed, us.display_order, us.metadata,
  u.email AS user_email, s.slug AS seal_slug, s.name AS seal_name, s.tier
FROM user_seals us
JOIN users u        ON us.user_id = u.id
JOIN academic_seals s ON us.seal_id = s.id
ORDER BY us.earned_at DESC;

-- §8.3 Seal progress
SELECT
  sp.id, sp.current_value, sp.target_value, sp.progress_percent, sp.status, sp.progress_data, sp.last_updated_at,
  u.email AS user_email, s.slug AS seal_slug, s.name AS seal_name
FROM seal_progress sp
JOIN users u          ON sp.user_id = u.id
JOIN academic_seals s ON sp.seal_id = s.id
ORDER BY sp.status, sp.progress_percent DESC;

-- §8.4 Reading activities
SELECT
  ra.id, ra.object_type, ra.domain, ra.read_at, ra.is_completed, ra.read_duration,
  u.email AS user_email,
  o.slug AS object_slug, o.title AS object_title
FROM reading_activities ra
JOIN users u   ON ra.user_id = u.id
JOIN objects o ON ra.object_id = o.id
ORDER BY ra.read_at DESC;

-- §8.5 Achievements (legacy) + user achievements
SELECT id, code, name, description, icon, points, criteria FROM achievements ORDER BY points DESC;
SELECT ua.id, ua.earned_at, ua.progress, u.email, a.code, a.name
FROM user_achievements ua
JOIN users u         ON ua.user_id = u.id
JOIN achievements a  ON ua.achievement_id = a.id
ORDER BY ua.earned_at DESC;

-- §8.6 Reputation events
SELECT re.id, re.event_type, re.points, re.reason, re.created_at, u.email
FROM reputation_events re
JOIN users u ON re.user_id = u.id
ORDER BY re.created_at DESC;


-- ===== §9  CONTENT LAYER =====

-- §9.1 Drafts
SELECT d.id, d.title, d.body, d.status, d.current_version, d.last_saved_at, d.created_at,
       o.slug AS object_slug, u.email AS writer_email
FROM drafts d
LEFT JOIN objects o ON d.object_id = o.id
JOIN users u        ON d.user_id = u.id
ORDER BY d.last_saved_at DESC NULLS LAST;

-- §9.2 Comments
SELECT
  c.id, c.body, c.is_resolved, c.created_at,
  o.slug AS object_slug, o.title AS object_title,
  u.email AS author_email,
  pc.id AS parent_comment_id
FROM comments c
JOIN objects o   ON c.object_id = o.id
JOIN users u      ON c.user_id = u.id
LEFT JOIN comments pc ON c.parent_id = pc.id
WHERE c.deleted_at IS NULL
ORDER BY c.created_at DESC;

-- §9.3 Media
SELECT
  m.id, m.filename, m.mime_type, m.size, m.url, m.thumbnail_url, m.alt_text,
  m.width, m.height, m.duration, m.metadata, m.created_at,
  o.slug AS object_slug, o.title AS object_title,
  u.email AS uploader_email
FROM media m
LEFT JOIN objects o ON m.object_id = o.id
JOIN users u        ON m.uploader_id = u.id
ORDER BY m.created_at DESC;

-- §9.4 Tags + usage
SELECT t.id, t.name, t.slug, t.description, t.color, t.usage_count, t.created_at
FROM tags t
ORDER BY t.usage_count DESC, t.name;

-- §9.5 Object ↔ Tag
SELECT ot.id, o.slug AS object_slug, o.title AS object_title, tg.name AS tag_name, tg.slug AS tag_slug
FROM object_tags ot
JOIN objects o  ON ot.object_id = o.id
JOIN tags tg    ON ot.tag_id = tg.id
ORDER BY o.title;

-- §9.6 Notifications
SELECT n.id, n.type, n.title, n.body, n.is_read, n.metadata, n.created_at,
       u.email AS recipient_email, o.slug AS object_slug
FROM notifications n
JOIN users u       ON n.user_id = u.id
LEFT JOIN objects o ON n.object_id = o.id
ORDER BY n.is_read, n.created_at DESC;


-- ===== §10  USERS & PROFILES =====
SELECT u.id, u.clerk_id, u.email, u.role, u.created_at, u.deleted_at,
       p.display_name, p.bio, p.avatar_url, p.reputation, p.level
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.deleted_at IS NULL
ORDER BY
  CASE u.role
    WHEN 'administrator' THEN 1 WHEN 'editor' THEN 2 WHEN 'reviewer' THEN 3
    WHEN 'writer' THEN 4 WHEN 'curator' THEN 5 WHEN 'contributor' THEN 6
    WHEN 'supporter' THEN 7 WHEN 'member' THEN 8 ELSE 9
  END,
  p.reputation DESC NULLS LAST;

-- ===== Part 05 END — ต่อด้วย Part 06 =====
