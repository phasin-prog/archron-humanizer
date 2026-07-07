# Seed Data: 21 Academic Seals (Complete)

Version: 1.0  
Purpose: SQL INSERT statements สำหรับ 21 seals ทั้งหมด

---

## Progression Seals (13 seals)

```sql
-- Level 1-2: Slate Seals
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-001', 'The Seeker', 'ผู้แสวงหา', 'slate', 'circle', 1, 'progression', 'first_read', 
 '{"articles_read": 1}'::jsonb),

('seal-002', 'The Reader', 'ผู้อ่าน', 'slate', 'circle', 2, 'progression', 'read_count',
 '{"articles_read": 10}'::jsonb),

('seal-003', 'The Collector', 'ผู้สะสม', 'slate', 'hexagon', 2, 'progression', 'first_collection',
 '{"collections_created": 1}'::jsonb);

-- Level 3-4: Blue Seals
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-004', 'The Scholar', 'นักวิชาการ', 'blue', 'octagon', 3, 'progression', 'read_count',
 '{"articles_read": 100}'::jsonb),

('seal-005', 'The Analyst', 'นักวิเคราะห์', 'blue', 'diamond', 3, 'progression', 'object_diversity',
 '{"object_types_read": 5}'::jsonb),

('seal-006', 'The Explorer', 'นักสำรวจ', 'blue', 'compass', 3, 'progression', 'domain_diversity',
 '{"domains_explored": 5}'::jsonb),

('seal-007', 'The Archivist', 'นักจดหมายเหตุ', 'blue', 'hexagon', 4, 'progression', 'collections',
 '{"collections_created": 5}'::jsonb),

('seal-008', 'The Cartographer', 'นักเขียนแผนที่', 'blue', 'hexagon', 4, 'progression', 'large_collection',
 '{"collection_size": 20}'::jsonb);

-- Level 5-6: Silver Seals
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-009', 'The Curator', 'ผู้ดูแล', 'silver', 'octagon', 5, 'progression', 'featured_collection',
 '{"featured_collections": 1}'::jsonb),

('seal-010', 'The Sage', 'ปราชญ์', 'silver', 'diamond', 5, 'progression', 'combined',
 '{"articles_read": 500, "collections_created": 10}'::jsonb),

('seal-011', 'The Navigator', 'ผู้นำทาง', 'silver', 'compass', 6, 'progression', 'graph_exploration',
 '{"concepts_explored": 50}'::jsonb),

('seal-012', 'The Luminary', 'ผู้ส่องสว่าง', 'silver', 'circle', 6, 'progression', 'featured_curator',
 '{"level": 5, "featured_collections": 3}'::jsonb);

-- Level 7: Gold Seals
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-013', 'The Architect', 'สถาปนิก', 'gold', 'octagon', 7, 'progression', 'ultimate',
 '{"level": 7, "articles_read": 1000, "collections_created": 20, "featured_collections": 5}'::jsonb);
```

---

## Domain Mastery Seals (4 seals)

```sql
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-014', 'Psychology Master', 'ปรมาจารย์จิตวิทยา', 'blue', 'circle', 4, 'domain', 'domain_mastery',
 '{"domain": "psychology", "articles_read": 50}'::jsonb),

('seal-015', 'Philosophy Master', 'ปรมาจารย์ปรัชญา', 'blue', 'circle', 4, 'domain', 'domain_mastery',
 '{"domain": "philosophy", "articles_read": 50}'::jsonb),

('seal-016', 'Language Master', 'ปรมาจารย์ภาษา', 'blue', 'circle', 4, 'domain', 'domain_mastery',
 '{"domain": "language", "articles_read": 50}'::jsonb),

('seal-017', 'Mythology Master', 'ปรมาจารย์เทพนิยาย', 'blue', 'circle', 4, 'domain', 'domain_mastery',
 '{"domain": "mythology", "articles_read": 50}'::jsonb);
```

---

## Time-Based Seals (2 seals)

```sql
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-018', 'The Persistent', 'ผู้แน่วแน่', 'blue', 'circle', 3, 'time', 'reading_streak',
 '{"streak_days": 30}'::jsonb),

('seal-019', 'The Devoted', 'ผู้ทุ่มเท', 'silver', 'circle', 5, 'time', 'reading_streak',
 '{"streak_days": 100}'::jsonb);
```

---

## Support Seals (2 seals)

```sql
INSERT INTO academic_seals (id, name, name_th, tier, shape, level, category, requirement_type, criteria) VALUES
('seal-020', 'The Companion', 'เพื่อนร่วมทาง', 'gold', 'circle', 7, 'support', 'subscription',
 '{"subscription_active": true}'::jsonb),

('seal-021', 'The Patron', 'ผู้อุปถัมภ์', 'gold', 'octagon', 7, 'support', 'lifetime_support',
 '{"lifetime_supporter": true}'::jsonb);
```

---

## สรุป

- **Progression:** 13 seals (Slate 3, Blue 5, Silver 4, Gold 1)
- **Domain:** 4 seals (Blue 4)
- **Time:** 2 seals (Blue 1, Silver 1)
- **Support:** 2 seals (Gold 2)
- **Total:** 21 seals

---

End of Seed Data
