-- +migrate Up
-- Migration 018: Seed academic seals data
-- Created: 2026-07-07
-- Purpose: Insert 21 academic seals catalog

-- Level 1-2: Slate Seals
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
('the-seeker', 'The Seeker', 'ผู้แสวงหา',
 'You entered the library and began your journey',
 'Read your first article',
 '○·', 'circle', '#465264', 'slate', 1, 'progression',
 '{"type":"read_count","target":1}'::jsonb, 1),

('the-reader', 'The Reader', 'ผู้อ่าน',
 'You read continuously, building knowledge',
 'Read 10 complete articles',
 '⌇', 'circle', '#465264', 'slate', 2, 'progression',
 '{"type":"read_count","target":10,"objectType":"article"}'::jsonb, 2),

('the-collector', 'The Collector', 'ผู้สะสม',
 'You began curating knowledge',
 'Create your first collection',
 '⬡', 'hexagon', '#465264', 'slate', 2, 'progression',
 '{"type":"first_collection","target":1}'::jsonb, 3);

-- Level 3-4: Blue Seals
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
('the-scholar', 'The Scholar', 'นักวิชาการ',
 'You have read extensively across the library',
 'Read 100 complete articles',
 '⬢', 'octagon', '#4A7BA7', 'blue', 3, 'progression',
 '{"type":"read_count","target":100}'::jsonb, 4),

('the-analyst', 'The Analyst', 'นักวิเคราะห์',
 'You explored diverse types of knowledge',
 'Read 5 different object types',
 '◆', 'diamond', '#4A7BA7', 'blue', 3, 'progression',
 '{"type":"object_type_diversity","target":5}'::jsonb, 5),

('the-explorer', 'The Explorer', 'นักสำรวจ',
 'You ventured across multiple domains',
 'Explore 5 different domains',
 '○', 'circle', '#4A7BA7', 'blue', 3, 'progression',
 '{"type":"domain_diversity","target":5}'::jsonb, 6),

('the-archivist', 'The Archivist', 'นักจดหมายเหตุ',
 'You curated multiple collections',
 'Create 5 collections',
 '⬡', 'hexagon', '#4A7BA7', 'blue', 4, 'progression',
 '{"type":"collections","target":5}'::jsonb, 7),

('the-cartographer', 'The Cartographer', 'นักเขียนแผนที่',
 'You mapped a vast territory of knowledge',
 'Create a collection with 20+ items',
 '⬢', 'hexagon', '#4A7BA7', 'blue', 4, 'progression',
 '{"type":"collection_size","target":20}'::jsonb, 8);

-- Level 5-6: Silver Seals
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
('the-curator', 'The Curator', 'ผู้ดูแล',
 'Your collection was featured by the community',
 'Have 1 featured collection',
 '⬢', 'octagon', '#8B9AA3', 'silver', 5, 'progression',
 '{"type":"featured_collection","target":1}'::jsonb, 9),

('the-sage', 'The Sage', 'ปราชญ์',
 'You achieved both breadth and depth',
 'Read 500 articles and create 10 collections',
 '◆', 'diamond', '#8B9AA3', 'silver', 5, 'progression',
 '{"type":"combined","articles_read":500,"collections_created":10}'::jsonb, 10),

('the-navigator', 'The Navigator', 'ผู้นำทาง',
 'You traversed the knowledge graph deeply',
 'Explore 50 connected concepts',
 '⊕', 'compass', '#8B9AA3', 'silver', 6, 'progression',
 '{"type":"graph_exploration","target":50}'::jsonb, 11),

('the-luminary', 'The Luminary', 'ผู้ส่องสว่าง',
 'You are a recognized curator',
 'Reach level 5 with 3 featured collections',
 '○', 'circle', '#8B9AA3', 'silver', 6, 'progression',
 '{"type":"featured_curator","level":5,"featured_collections":3}'::jsonb, 12);

-- Level 7: Gold Seals
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
('the-architect', 'The Architect', 'สถาปนิก',
 'You mastered the art of knowledge curation',
 'Reach level 7: 1000+ reads, 20 collections, 5 featured',
 '⬢', 'octagon', '#C9A961', 'gold', 7, 'progression',
 '{"type":"ultimate","level":7,"articles_read":1000,"collections_created":20,"featured_collections":5}'::jsonb, 13);

-- Domain Mastery Seals (Blue tier, no level requirement)
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, domain_id, criteria, sort_order) VALUES
('psychology-master', 'Psychology Master', 'ปรมาจารย์จิตวิทยา',
 'Master of psychological knowledge',
 'Read 50+ articles in Psychology',
 '⬢', 'circle', '#5A9FB5', 'blue', NULL, 'domain',
 (SELECT id FROM domains WHERE slug = 'psychology'),
 '{"type":"domain_read_count","target":50,"domain":"psychology"}'::jsonb, 14),

('philosophy-master', 'Philosophy Master', 'ปรมาจารย์ปรัชญา',
 'Master of philosophical thought',
 'Read 50+ articles in Philosophy',
 '⬢', 'circle', '#9688B8', 'blue', NULL, 'domain',
 (SELECT id FROM domains WHERE slug = 'philosophy'),
 '{"type":"domain_read_count","target":50,"domain":"philosophy"}'::jsonb, 15),

('language-master', 'Language Master', 'ปรมาจารย์ภาษา',
 'Master of linguistic knowledge',
 'Read 50+ articles in Language',
 '⬢', 'circle', '#6FA589', 'blue', NULL, 'domain',
 (SELECT id FROM domains WHERE slug = 'language'),
 '{"type":"domain_read_count","target":50,"domain":"language"}'::jsonb, 16),

('mythology-master', 'Mythology Master', 'ปรมาจารย์เทพนิยาย',
 'Master of mythological knowledge',
 'Read 50+ articles in Mythology',
 '⬢', 'circle', '#B56A6A', 'blue', NULL, 'domain',
 (SELECT id FROM domains WHERE slug = 'mythology'),
 '{"type":"domain_read_count","target":50,"domain":"mythology"}'::jsonb, 17);

-- Time-Based Seals
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
('the-persistent', 'The Persistent', 'ผู้แน่วแน่',
 'You read consistently for 30 days',
 'Maintain a 30-day reading streak',
 '○', 'circle', '#4A7BA7', 'blue', 3, 'time',
 '{"type":"reading_streak","target":30}'::jsonb, 18),

('the-devoted', 'The Devoted', 'ผู้ทุ่มเท',
 'You read consistently for 100 days',
 'Maintain a 100-day reading streak',
 '○', 'circle', '#8B9AA3', 'silver', 5, 'time',
 '{"type":"reading_streak","target":100}'::jsonb, 19);

-- Support Seals (Gold tier)
INSERT INTO academic_seals (slug, name, name_th, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
('the-companion', 'The Companion', 'เพื่อนร่วมทาง',
 'You support ARCHRON journey',
 'Active subscription member',
 '⊕', 'compass', '#C9A961', 'gold', 7, 'support',
 '{"type":"subscription","subscription_active":true}'::jsonb, 20),

('the-patron', 'The Patron', 'ผู้อุปถัมภ์',
 'You are a lifetime supporter',
 'Lifetime supporter status',
 '◆', 'diamond', '#C9A961', 'gold', 7, 'support',
 '{"type":"lifetime_support","lifetime_supporter":true}'::jsonb, 21);

-- +migrate Down
-- Rollback: Remove all seeded seals
DELETE FROM academic_seals WHERE slug IN (
  'the-seeker', 'the-reader', 'the-collector',
  'the-scholar', 'the-analyst', 'the-explorer', 'the-archivist', 'the-cartographer',
  'the-curator', 'the-sage', 'the-navigator', 'the-luminary',
  'the-architect',
  'psychology-master', 'philosophy-master', 'language-master', 'mythology-master',
  'the-persistent', 'the-devoted',
  'the-companion', 'the-patron'
);
