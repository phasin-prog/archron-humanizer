-- +migrate Up
-- Migration 005: Extend thinkers table with Constellation fields
-- Created: 2026-07-07
-- Purpose: Add constellation-related columns to existing thinkers table

ALTER TABLE thinkers
ADD COLUMN primary_domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
ADD COLUMN constellation_id UUID REFERENCES constellations(id) ON DELETE SET NULL,
ADD COLUMN layer_id UUID REFERENCES constellation_layers(id) ON DELETE SET NULL,
ADD COLUMN influence_score INTEGER DEFAULT 0,
ADD COLUMN time_period VARCHAR(100),
ADD COLUMN primary_work TEXT,
ADD COLUMN key_concepts TEXT[];

-- Indexes for performance
CREATE INDEX idx_thinkers_constellation ON thinkers(constellation_id);
CREATE INDEX idx_thinkers_layer ON thinkers(layer_id);
CREATE INDEX idx_thinkers_primary_domain ON thinkers(primary_domain_id);
CREATE INDEX idx_thinkers_influence ON thinkers(influence_score DESC);

-- Comments
COMMENT ON COLUMN thinkers.primary_domain_id IS 'Main domain of expertise';
COMMENT ON COLUMN thinkers.constellation_id IS 'Belongs to which constellation group';
COMMENT ON COLUMN thinkers.layer_id IS 'Which layer in the intellectual development model';
COMMENT ON COLUMN thinkers.influence_score IS 'Relative influence score (0-100)';
COMMENT ON COLUMN thinkers.time_period IS 'Active period (e.g., "1856-1939")';
COMMENT ON COLUMN thinkers.primary_work IS 'Most important work or contribution';
COMMENT ON COLUMN thinkers.key_concepts IS 'Array of key concepts introduced';

-- +migrate Down
-- Rollback: Remove constellation columns from thinkers
ALTER TABLE thinkers
DROP COLUMN IF EXISTS key_concepts,
DROP COLUMN IF EXISTS primary_work,
DROP COLUMN IF EXISTS time_period,
DROP COLUMN IF EXISTS influence_score,
DROP COLUMN IF EXISTS layer_id,
DROP COLUMN IF EXISTS constellation_id,
DROP COLUMN IF EXISTS primary_domain_id;
