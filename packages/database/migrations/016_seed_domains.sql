-- +migrate Up
-- Migration 016: Seed domains data
-- Created: 2026-07-07
-- Purpose: Insert 12 knowledge domains

INSERT INTO domains (slug, name, name_th, description, color, icon, sort_order) VALUES
  ('psychology', 'Psychology', 'จิตวิทยา',
   'The study of mind and behavior, consciousness, and human experience',
   '#5A9FB5', '🧠', 1),

  ('philosophy', 'Philosophy', 'ปรัชญา',
   'The study of fundamental questions about existence, knowledge, values, and meaning',
   '#9688B8', '💭', 2),

  ('anthropology', 'Anthropology', 'มานุษยวิทยา',
   'The study of human societies, cultures, and their development',
   '#B8866F', '🗿', 3),

  ('history', 'History', 'ประวัติศาสตร์',
   'The study of past events and human affairs',
   '#8B7D6B', '📜', 4),

  ('language', 'Language', 'ภาษา',
   'The study of language structure, meaning, and usage',
   '#6FA589', '💬', 5),

  ('mythology', 'Mythology', 'เทพนิยาย',
   'The study of myths, legends, and sacred narratives',
   '#B56A6A', '⚡', 6),

  ('religion', 'Religion', 'ศาสนา',
   'The study of faith, belief systems, and spiritual practices',
   '#9B8D7E', '🕉️', 7),

  ('science', 'Science', 'วิทยาศาสตร์',
   'The systematic study of the natural world through observation and experiment',
   '#7B9DA5', '🔬', 8),

  ('symbolism', 'Symbolism', 'สัญลักษณ์วิทยา',
   'The study of symbols, signs, and their meanings',
   '#A8869B', '🔣', 9),

  ('art', 'Art', 'ศิลปะ',
   'The study of creative expression and aesthetic experience',
   '#A89B7E', '🎨', 10),

  ('ai', 'AI', 'ปัญญาประดิษฐ์',
   'The study of artificial intelligence and machine cognition',
   '#6B8FA5', '🤖', 11),

  ('civilization', 'Civilization', 'อารยธรรม',
   'The study of human societies and their cultural development',
   '#9A8B6D', '🏛️', 12);

-- +migrate Down
-- Rollback: Remove seeded domains
DELETE FROM domains WHERE slug IN (
  'psychology', 'philosophy', 'anthropology', 'history',
  'language', 'mythology', 'religion', 'science',
  'symbolism', 'art', 'ai', 'civilization'
);
