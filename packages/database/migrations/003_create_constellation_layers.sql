-- +migrate Up
-- Migration 003: Create constellation_layers table
-- Created: 2026-07-07
-- Purpose: 5 layers of Constellation Model (Origins → Modern)

CREATE TABLE constellation_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT,
  sequence INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_constellation_layers_slug ON constellation_layers(slug);
CREATE INDEX idx_constellation_layers_sequence ON constellation_layers(sequence);

-- Comments
COMMENT ON TABLE constellation_layers IS 'Five layers of intellectual development: Origins, Foundational, Constellation, Traditions, Modern';
COMMENT ON COLUMN constellation_layers.sequence IS 'Display order (1-5)';

-- +migrate Down
-- Rollback: Drop constellation_layers table
DROP TABLE IF EXISTS constellation_layers CASCADE;
