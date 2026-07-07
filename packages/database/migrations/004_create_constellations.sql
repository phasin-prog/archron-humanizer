-- +migrate Up
-- Migration 004: Create constellations table
-- Created: 2026-07-07
-- Purpose: Groupings of thinkers within domains

CREATE TABLE constellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name VARCHAR(300) NOT NULL,
  name_th VARCHAR(300),
  description TEXT,
  time_period VARCHAR(100),
  central_question TEXT,
  layer_id UUID REFERENCES constellation_layers(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for foreign keys and queries
CREATE INDEX idx_constellations_domain ON constellations(domain_id);
CREATE INDEX idx_constellations_layer ON constellations(layer_id);
CREATE INDEX idx_constellations_sort ON constellations(domain_id, sort_order);

-- Comments
COMMENT ON TABLE constellations IS 'Groups of thinkers organized by domain and theme';
COMMENT ON COLUMN constellations.central_question IS 'The main question this constellation addresses';
COMMENT ON COLUMN constellations.time_period IS 'Historical period (e.g., "1890-1960")';

-- +migrate Down
-- Rollback: Drop constellations table
DROP TABLE IF EXISTS constellations CASCADE;
