-- +migrate Up
-- Migration 017: Seed constellation layers data
-- Created: 2026-07-07
-- Purpose: Insert 5 layers of Constellation Model

INSERT INTO constellation_layers (slug, name, name_th, description, sequence) VALUES
  ('origins', 'Origins', 'รากกำเนิด',
   'Ancient texts, myths, and foundational narratives that shaped human understanding',
   1),

  ('foundational', 'Foundational Thinkers', 'ผู้วางรากฐาน',
   'Key thinkers who established the fundamental frameworks of each domain',
   2),

  ('constellation', 'Constellation of Thinkers', 'กลุ่มดาวนักคิด',
   'Groups of thinkers organized by shared questions and themes',
   3),

  ('traditions', 'Major Traditions', 'สำนักสำคัญ',
   'Schools of thought and intellectual traditions that emerged from the constellations',
   4),

  ('modern', 'Modern Development', 'พัฒนาการสมัยใหม่',
   'Contemporary developments and new directions in each domain',
   5);

-- +migrate Down
-- Rollback: Remove seeded layers
DELETE FROM constellation_layers WHERE slug IN (
  'origins', 'foundational', 'constellation', 'traditions', 'modern'
);
