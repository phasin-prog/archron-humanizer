-- +migrate Up
-- Migration 019: Seed constellation examples
-- Created: 2026-07-07
-- Purpose: Insert example constellations for Psychology domain

-- Get domain IDs for reference
DO $$
DECLARE
  psychology_domain_id UUID;
  foundational_layer_id UUID;
  constellation_layer_id UUID;
BEGIN
  -- Get domain and layer IDs
  SELECT id INTO psychology_domain_id FROM domains WHERE slug = 'psychology';
  SELECT id INTO foundational_layer_id FROM constellation_layers WHERE slug = 'foundational';
  SELECT id INTO constellation_layer_id FROM constellation_layers WHERE slug = 'constellation';

  -- Insert example constellations for Psychology
  INSERT INTO constellations (domain_id, name, name_th, description, time_period, central_question, layer_id, sort_order) VALUES
  (psychology_domain_id, 'Psychoanalytic Constellation', 'กลุ่มดาวจิตวิเคราะห์',
   'Thinkers who explored the unconscious mind and its influence on behavior',
   '1890-1960',
   'What hidden forces in the unconscious shape our thoughts and actions?',
   constellation_layer_id, 1),

  (psychology_domain_id, 'Behavioral Constellation', 'กลุ่มดาวพฤติกรรมนิยม',
   'Thinkers who focused on observable behavior and learning',
   '1910-1970',
   'How can we understand and modify behavior through environmental factors?',
   constellation_layer_id, 2),

  (psychology_domain_id, 'Cognitive Constellation', 'กลุ่มดาวปัญญานิยม',
   'Thinkers who studied mental processes and information processing',
   '1950-present',
   'How do we perceive, remember, and think about the world?',
   constellation_layer_id, 3),

  (psychology_domain_id, 'Humanistic Constellation', 'กลุ่มดาวมนุษยนิยม',
   'Thinkers who emphasized human potential and self-actualization',
   '1950-1980',
   'What does it mean to live authentically and reach our full potential?',
   constellation_layer_id, 4);

END $$;

-- Insert example traditions
DO $$
DECLARE
  psychology_domain_id UUID;
BEGIN
  SELECT id INTO psychology_domain_id FROM domains WHERE slug = 'psychology';

  INSERT INTO traditions (slug, name, name_th, description, domain_id, time_period, key_principles) VALUES
  ('psychoanalysis', 'Psychoanalysis', 'จิตวิเคราะห์',
   'A therapeutic approach emphasizing unconscious processes',
   psychology_domain_id,
   '1890-present',
   ARRAY['unconscious mind', 'defense mechanisms', 'childhood experiences', 'transference']),

  ('behaviorism', 'Behaviorism', 'พฤติกรรมนิยม',
   'A psychological approach focusing on observable behavior',
   psychology_domain_id,
   '1910-1970',
   ARRAY['classical conditioning', 'operant conditioning', 'reinforcement', 'environmental determinism']),

  ('cognitive-psychology', 'Cognitive Psychology', 'จิตวิทยาปัญญา',
   'The study of mental processes and information processing',
   psychology_domain_id,
   '1950-present',
   ARRAY['information processing', 'memory systems', 'schemas', 'mental models']),

  ('humanistic-psychology', 'Humanistic Psychology', 'จิตวิทยามนุษยนิยม',
   'An approach emphasizing human potential and growth',
   psychology_domain_id,
   '1950-present',
   ARRAY['self-actualization', 'personal growth', 'authenticity', 'holistic view']);

END $$;

-- +migrate Down
-- Rollback: Remove example data
DELETE FROM traditions WHERE slug IN (
  'psychoanalysis', 'behaviorism', 'cognitive-psychology', 'humanistic-psychology'
);

DELETE FROM constellations WHERE name IN (
  'Psychoanalytic Constellation',
  'Behavioral Constellation',
  'Cognitive Constellation',
  'Humanistic Constellation'
);
