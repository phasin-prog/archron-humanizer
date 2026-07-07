-- +migrate Up
-- Migration 015: Add comprehensive indexes for performance
-- Created: 2026-07-07
-- Purpose: Optimize queries for Constellation and Seals systems

-- Constellation query optimizations
CREATE INDEX idx_thinkers_domain_influence ON thinkers(primary_domain_id, influence_score DESC)
  WHERE primary_domain_id IS NOT NULL;

CREATE INDEX idx_thinkers_constellation_layer ON thinkers(constellation_id, layer_id)
  WHERE constellation_id IS NOT NULL;

CREATE INDEX idx_constellations_domain_sort ON constellations(domain_id, sort_order, layer_id);

-- Seal progress query optimizations
CREATE INDEX idx_user_seals_user_earned ON user_seals(user_id, earned_at DESC);

CREATE INDEX idx_seal_progress_in_progress ON seal_progress(user_id, progress_percent DESC)
  WHERE status = 'in_progress';

-- Reading activities optimizations
CREATE INDEX idx_reading_user_completed_date ON reading_activities(user_id, read_at DESC)
  WHERE is_completed = true;

CREATE INDEX idx_reading_user_domain_completed ON reading_activities(user_id, domain, is_completed);

-- Composite indexes for common queries
CREATE INDEX idx_thinker_domains_primary_domain ON thinker_domains(thinker_id, domain_id)
  WHERE is_primary = true;

CREATE INDEX idx_thinker_relationships_source_type ON thinker_relationships(source_thinker_id, relationship_type);

CREATE INDEX idx_traditions_domain_slug ON traditions(domain_id, slug)
  WHERE domain_id IS NOT NULL;

-- Comments
COMMENT ON INDEX idx_thinkers_domain_influence IS 'Optimize: Get top thinkers by domain';
COMMENT ON INDEX idx_constellations_domain_sort IS 'Optimize: List constellations by domain';
COMMENT ON INDEX idx_seal_progress_in_progress IS 'Optimize: Show seals near completion';
COMMENT ON INDEX idx_reading_user_completed_date IS 'Optimize: User reading history';

-- +migrate Down
-- Rollback: Drop performance indexes
DROP INDEX IF EXISTS idx_traditions_domain_slug;
DROP INDEX IF EXISTS idx_thinker_relationships_source_type;
DROP INDEX IF EXISTS idx_thinker_domains_primary_domain;
DROP INDEX IF EXISTS idx_reading_user_domain_completed;
DROP INDEX IF EXISTS idx_reading_user_completed_date;
DROP INDEX IF EXISTS idx_seal_progress_in_progress;
DROP INDEX IF EXISTS idx_user_seals_user_earned;
DROP INDEX IF EXISTS idx_constellations_domain_sort;
DROP INDEX IF EXISTS idx_thinkers_constellation_layer;
DROP INDEX IF EXISTS idx_thinkers_domain_influence;
